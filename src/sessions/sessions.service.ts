/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppRoles, MENTOR_PACKAGE_MODEL_NAME, PackageTypes, PAYMENT_MODEL_NAME, sessionStatus, SESSION_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';
import { create_session_meeting, delete_session_meeting, get_session_meeting } from '../common/utils/googleMeetCreator'
import { ISession } from '../models/sessions.model';
import { IToken } from '../models/auth/tokens.model';

import { IMentorPackage } from '../models/mentorPackages.model';
import sessionInsertDTO from './DTOs/session.insert';
import { generateUUID } from 'src/common/utils/generalUtils';
import sessionUpdateDTO from './DTOs/session.update';
import googleMeetResponseDTO from './DTOs/google.meet.response';
import { IPayment } from 'src/models/payments.model';
import paymentInsertDTO from './DTOs/payment.insert';
import { IUser } from 'src/models/users.model';





@Injectable()
export class SessionsService {
    constructor(@InjectModel(SESSION_MODEL_NAME) private _sessionModel: Model<ISession>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>,
        @InjectModel(MENTOR_PACKAGE_MODEL_NAME) private _packageModel: Model<IMentorPackage>,
        @InjectModel(PAYMENT_MODEL_NAME) private _paymentModel: Model<IPayment>,
        @InjectModel(USER_MODEL_NAME) private _userModel: Model<IUser>) { }

    async createSession(token: string, session_insert_dto: sessionInsertDTO) {
        console.log('create session');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        const found_package = await this.getPackageDetails(session_insert_dto.packageId);
        if (found_package == null) { throw new ConflictException({ message: "package not found" }); }


        // Get the time frame (duration)
        const duration = await this.getPackageDuration(session_insert_dto.packageId);
        if (duration == null) { throw new ConflictException({ message: "meeting duration error" }); }
        console.log('create meeting link');
        let google_meet_response = new googleMeetResponseDTO();
        google_meet_response = await create_session_meeting(
            session_insert_dto.bookedDate, session_insert_dto.startTime, duration, session_insert_dto.timeZone
        );
        if (google_meet_response.busy && google_meet_response.busy == true) {
            throw new ConflictException({ message: "busy time slot" });
        }

        const session_insert = new this._sessionModel({
            sessionId: generateUUID(),
            packageId: session_insert_dto.packageId,
            mentorId: session_insert_dto.mentorId,
            developerId: userId,
            bookedDate: session_insert_dto.bookedDate,
            startTime: google_meet_response.start,
            endTime: google_meet_response.end,
            timeZone: session_insert_dto.timeZone,
            status: sessionStatus.UPCOMING,
            meetingLink: google_meet_response.meet_link,
            eventId: google_meet_response.event_id,
            amount: found_package.price,
            currency: found_package.currency,
            paymentStatus: 0
        });
        const result = await session_insert.save();
        return result;
    }


    async update(sessionId: string, session_update_dto: sessionUpdateDTO) {
        console.log('update session');
        const found_session = await this._sessionModel.findOne({
            sessionId: sessionId
        });
        if (!found_session) {
            throw new ConflictException({ message: "session already deleted" });
        }
        //delete old meeting link
        await delete_session_meeting(found_session.eventId);

        // Get the time frame (duration)
        const duration = await this.getPackageDuration(found_session.packageId);
        if (duration == null) { throw new ConflictException({ message: "meeting duration error" }); }

        let google_meet_response = new googleMeetResponseDTO();
        google_meet_response = await create_session_meeting(
            session_update_dto.bookedDate, session_update_dto.startTime, duration, session_update_dto.timeZone
        );
        if (google_meet_response.busy && google_meet_response.busy == true) {
            throw new ConflictException({ message: "busy time slot" });
        }

        return await this._sessionModel.findOneAndUpdate({
            sessionId: sessionId
        }, {
                bookedDate: session_update_dto.bookedDate,
                startTime: google_meet_response.start,
                endTime: google_meet_response.end,
                timeZone: session_update_dto.timeZone,
                meetingLink: google_meet_response.meet_link,
                eventId: google_meet_response.event_id
            }, { upsert: false, new: true });
    }

    async delete(sessionId: string) {
        console.log('delete session');
        const found_session = await this._sessionModel.findOne({
            sessionId: sessionId
        });
        if (!found_session) {
            throw new ConflictException({ message: "session already deleted" });
        }
        //delete old meeting link
        await delete_session_meeting(found_session.eventId);
        return await this._sessionModel.findOneAndDelete({ sessionId: sessionId });
    }

    async findByMentorId(mentor_id: string) {
        console.log('find mentor sessions');
        return await this._sessionModel.find({ mentorId: mentor_id });
    }

    async findByDeveloperId(developer_id: string) {
        console.log('find developer sessions');
        return await this._sessionModel.find({ developerId: developer_id });
    }

    async getSelfSessions(token: string) {
        const query = {};
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        query["$or"] = [
            { mentorId: userId },
            { developerId: userId }
        ];
        return await this._sessionModel.find(query).sort({ createdAt: -1 });
    }


    async getPackageDuration(packageId: string): Promise<number> {
        console.log('getPackageById');
        const found_package = await this._packageModel.findOne({
            packageId: packageId
        });

        if (found_package) {
            const duration = found_package.packageType;
            if (duration == PackageTypes.MINUTES_15) {
                return 15;
            }
            else if (duration == PackageTypes.MINUTES_30) {
                return 30;
            }
            else if (duration == PackageTypes.HOURS_1) {
                return 60;
            }
        }
        return null;
    }

    async getPackageDetails(packageId: string) {
        console.log('getPackageDetails');
        const found_package = await this._packageModel.findOne({
            packageId: packageId
        });
        return found_package;
    }


    async registerPayment(payment_insert_dto: paymentInsertDTO) {
        console.log('register-payment')

        const found_session = await this._sessionModel.findOne({ sessionId: payment_insert_dto.sessionId });
        if (!found_session)
            throw new NotFoundException({ message: "session doesn't exist" });


        if (!await this.validate_userId(found_session.mentorId))
            throw new NotFoundException({ message: 'mentor not found' });
        if (!await this.validate_userId(found_session.developerId))
            throw new NotFoundException({ message: 'developer not found' });

        console.log(found_session);
        const payment_insert = new this._paymentModel({
            paymentId: generateUUID(),
            sessionId: payment_insert_dto.sessionId,
            mentorId: found_session.mentorId,
            developerId: found_session.developerId,
            amount: payment_insert_dto.amount,
            currency: payment_insert_dto.currency
        });
        const result_payment = await payment_insert.save();
        console.log(result_payment);
        const result_balance = await this._userModel.findOneAndUpdate({
            userId: found_session.mentorId, role: AppRoles.MENTOR
        }, { $inc: { wallletBalance: payment_insert_dto.amount } }, { upsert: false, new: true });
        console.log(result_balance);
        const _return = {
            payment: result_payment.toJSON(),
            mentor: result_balance.toJSON()
        };

        return _return;
    }

    async validate_userId(user_id: string) {
        let valid = true;
        const found_user = await this._userModel.findOne({ userId: user_id });
        if (!found_user) { valid = false; }
        return valid;
    }




    // get_date_diff = (input_date: string) => {
    //     console.log(input_date);
    //     const date_1 = new Date('10/25/2021');
    //     const date_2 = new Date();
    //     const difference = date_1.getTime() - date_2.getTime();
    //     console.log(difference);
    //     const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    //     console.log(TotalDays + ' days to world Cup');
    //     return TotalDays;
    // }


    async get_date_diff(input_date: string) {
        console.log(input_date);
        const date_1 = new Date('10/25/2021');
        const date_2 = new Date();
        const difference = date_1.getTime() - date_2.getTime();
        console.log(difference);
        const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        console.log(TotalDays + ' days to world Cup');
        return TotalDays;
    }



    async findByMentorId_admin(mentor_id: string) {
        console.log('find mentor sessions - admin');
        let paid_list = [];
        let pending_list = [];
        let new_list = [];
        const seesions_list = await this._sessionModel.find({ mentorId: mentor_id });
        // console.log(seesions_list)
        new_list = seesions_list.filter(function(element) {
            const date_2 = new Date(element.bookedDate);
            const date_1 = new Date();
            const difference = date_1.getTime() - date_2.getTime();
            console.log(difference);
            const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            console.log(TotalDays + ' days to world Cup');
            if (element.paymentStatus == 0 && TotalDays >= 14) {
                return true;
            }
        });
        let new_total = 0;
        new_list.forEach(item => {
            new_total += item.amount;
        });

        pending_list = seesions_list.filter(function(element) {
            if (element.paymentStatus == 1) {
                return true;
            }
        });
        let pending_total = 0;
        pending_list.forEach(item => {
            pending_total += item.amount;
        });
        paid_list = seesions_list.filter(function(element) {
            if (element.paymentStatus == 2) {
                return true;
            }
        });
        let paid_total = 0;
        paid_list.forEach(item => {
            paid_total += item.amount;
        });
        const _return = {
            paid: {
                list: paid_list,
                total: paid_total
            },
            pending: {
                list: pending_list,
                total: pending_total
            },
            new: {
                list: new_list,
                total: new_total
            }
        };
        return _return;
    }

}
