/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MENTOR_PACKAGE_MODEL_NAME, PackageTypes, sessionStatus, SESSION_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';
import { create_session_meeting, delete_session_meeting } from '../common/utils/googleMeetCreator'
import { ISession } from '../models/sessions.model';
import { IToken } from '../models/auth/tokens.model';
import { IMentorPackage } from '../models/mentorPackages.model';
import sessionInsertDTO from './DTOs/session.insert';
import { generateUUID } from 'src/common/utils/generalUtils';
import sessionUpdateDTO from './DTOs/session.update';
import googleMeetResponseDTO from './DTOs/google.meet.response';





@Injectable()
export class SessionsService {
    constructor(@InjectModel(SESSION_MODEL_NAME) private _sessionModel: Model<ISession>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>,
        @InjectModel(MENTOR_PACKAGE_MODEL_NAME) private _packageModel: Model<IMentorPackage>) { }

    async createSession(token: string, session_insert_dto: sessionInsertDTO) {
        console.log('create session');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

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
            eventId: google_meet_response.event_id
        });
        const result = await session_insert.save();
        return result;
    }


    async update(sessionId: string, session_update_dto: sessionUpdateDTO) {
        console.log('update package');
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
}
