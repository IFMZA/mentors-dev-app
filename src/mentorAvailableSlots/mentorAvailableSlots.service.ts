/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MENTOR_AVAILABLE_SLOT_MODEL_NAME, MENTOR_PACKAGE_MODEL_NAME, PackageTypes, sessionStatus, SESSION_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';

import { IMentorAvailableSlot } from '../models/mentorAvailableSlots.model';
import { ISession } from '../models/sessions.model';
import { IMentorPackage } from '../models/mentorPackages.model';


import { IToken } from '../models/auth/tokens.model';
import { generateUUID } from 'src/common/utils/generalUtils';
import slotInsertDTO from './DTOs/mentorAvailableSlots.insert';
import slotUpdateDTO from './DTOs/mentorAvailableSlots.update';
import slotSaveManyDTO from './DTOs/mentorAvailableSlots.many';
import { OpTypes } from './DTOs/saveMany.operation.types';






@Injectable()
export class MentorAvailableSlotsService {
    constructor(@InjectModel(MENTOR_AVAILABLE_SLOT_MODEL_NAME) private _slotModel: Model<IMentorAvailableSlot>,
        @InjectModel(SESSION_MODEL_NAME) private _sessionModel: Model<ISession>,
        @InjectModel(MENTOR_PACKAGE_MODEL_NAME) private _packageModel: Model<IMentorPackage>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>) { }

    async createSlot(token: string, slot_insert_dto: slotInsertDTO) {
        console.log('create slot');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        //Check Slot Availability
        let isValidSlot = true;
        isValidSlot = await this.checkSlotAvailability(userId, slot_insert_dto.availableDate, slot_insert_dto.fromTime, slot_insert_dto.ToTime);
        if (!isValidSlot)
            throw new ConflictException({
                message: `slot conflicts with another existing one ${slot_insert_dto.availableDate + " F:" + slot_insert_dto.fromTime + " T:" + slot_insert_dto.ToTime}`
            });


        const slot_insert = new this._slotModel({
            mentorId: userId,
            slotId: generateUUID(),
            availableDate: slot_insert_dto.availableDate,
            fromTime: slot_insert_dto.fromTime,
            ToTime: slot_insert_dto.ToTime,
            createdAt: Date.now()
        });
        const result = await slot_insert.save();
        return result;
    }

    async checkSlotAvailability(userId: string, new_available_date: string, new_from_time: string, new_to_time: string) {
        console.log(new_available_date);
        const new_start_time = new Date(new_available_date + " " + new_from_time);
        const new_end_time = new Date(new_available_date + " " + new_to_time);
        const db_slots = await this.findAll({ mentorId: userId, availableDate: new_available_date });
        let isValidSlot = true;
        if (db_slots) {
            for (let idx = 0; idx < db_slots.length; idx++) {
                const db_slot = db_slots[idx];
                const _availableDate = db_slot.availableDate.toISOString().split('T')[0];
                const old_start_time = new Date(_availableDate + " " + db_slot.fromTime);
                const old_end_time = new Date(_availableDate + " " + db_slot.ToTime);
                console.log('checking-slots:')
                console.log('new-start: ' + new_start_time);
                console.log('old-start: ' + old_start_time);
                console.log('old-end: ' + old_end_time);
                if (new_start_time >= old_start_time && new_start_time <= old_end_time) {
                    isValidSlot = false;
                    break;
                }
                if (new_end_time >= old_start_time && new_end_time <= old_end_time) {
                    isValidSlot = false;
                    break;
                }
            }
        }
        return isValidSlot;
    }

    async createManySlots(token: string, slot_list_insert_dto: [slotInsertDTO]) {
        console.log('create many slot');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        const slots_list_to_insert = [];

        //Check Availability
        for (let idx = 0; idx < slot_list_insert_dto.length; idx++) {
            const slot_insert_dto = slot_list_insert_dto[idx];
            let isValidSlot = true;
            isValidSlot = await this.checkSlotAvailability(userId, slot_insert_dto.availableDate, slot_insert_dto.fromTime, slot_insert_dto.ToTime);
            if (!isValidSlot)
                throw new ConflictException({
                    message: `slot conflicts with another existing one ${slot_insert_dto.availableDate + " F:" + slot_insert_dto.fromTime + " T:" + slot_insert_dto.ToTime}`
                });
        }

        slot_list_insert_dto.forEach(slot_insert_dto => {
            const slot_insert = new this._slotModel({
                mentorId: userId,
                slotId: generateUUID(),
                availableDate: slot_insert_dto.availableDate,
                fromTime: slot_insert_dto.fromTime,
                ToTime: slot_insert_dto.ToTime,
                createdAt: Date.now()
            });
            slots_list_to_insert.push(slot_insert);
        });

        return await this._slotModel.insertMany(slots_list_to_insert);
    }


    async saveManySlots(token: string, slot_list_dto: [slotSaveManyDTO]) {
        console.log('save many slot');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;



        const delete_list_response = [];
        slot_list_dto.filter(function(element) { return element.opType == OpTypes.DELETED })
            .forEach(async slot_delete_dto => {
                const delete_response = await this._slotModel.findOneAndDelete({ slotId: slot_delete_dto.slotId });
                delete_list_response.push(delete_response);
            });

        //Check Availability before update
        const slots_to_check = slot_list_dto.filter(function(element) { return element.opType == OpTypes.MODIFIED || element.opType == OpTypes.NEW })
        for (let idx = 0; idx < slots_to_check.length; idx++) {
            const slot_insert_dto = slots_to_check[idx];
            let isValidSlot = true;
            isValidSlot = await this.checkSlotAvailability(userId, slot_insert_dto.availableDate, slot_insert_dto.fromTime, slot_insert_dto.ToTime);
            if (!isValidSlot)
                throw new ConflictException(
                    {
                        message: `slot conflicts with another existing one ${slot_insert_dto.availableDate + " F:" + slot_insert_dto.fromTime + " T:" + slot_insert_dto.ToTime}`
                    });
        }

        const update_list_response = [];
        slot_list_dto.filter(function(element) { return element.opType == OpTypes.MODIFIED })
            .forEach(async slot_update_dto => {
                const _slotId = slot_update_dto.slotId;
                delete slot_update_dto.slotId;
                const update_response = await this._slotModel.findOneAndUpdate({
                    slotId: _slotId
                }, slot_update_dto, { upsert: false, new: true });
                update_list_response.push(update_response);
            });

        const slots_list_to_insert = [];
        slot_list_dto.filter(function(element) { return element.opType == OpTypes.NEW })
            .forEach(slot_insert_dto => {
                const slot_insert = new this._slotModel({
                    mentorId: userId,
                    slotId: generateUUID(),
                    availableDate: slot_insert_dto.availableDate,
                    fromTime: slot_insert_dto.fromTime,
                    ToTime: slot_insert_dto.ToTime,
                    createdAt: Date.now()
                });
                slots_list_to_insert.push(slot_insert);
            });
        const insert_list_response = await this._slotModel.insertMany(slot_list_dto);



        return {
            ...insert_list_response,
            ...update_list_response,
            ...delete_list_response
        };
    }


    async update(slotId: string, slot_update_dto: slotUpdateDTO) {
        console.log('update package');
        const mentor_id = await this.findMentorId({ slotId: slotId });
        //Check Slot Availability
        let isValidSlot = true;
        isValidSlot = await this.checkSlotAvailability(mentor_id, slot_update_dto.availableDate, slot_update_dto.fromTime, slot_update_dto.ToTime);
        if (!isValidSlot)
            throw new ConflictException({
                message: `slot conflicts with another existing one ${slot_update_dto.availableDate + " F:" + slot_update_dto.fromTime + " T:" + slot_update_dto.ToTime}`
            });
        return await this._slotModel.findOneAndUpdate({
            slotId: slotId
        }, slot_update_dto, { upsert: false, new: true });
    }

    async delete(slotId: string) {
        console.log('delete slot');
        return await this._slotModel.findOneAndDelete({ slotId: slotId });
    }

    async findSelfSlots(token: string) {
        console.log('find self slot');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;
        return await this._slotModel.find({ mentorId: userId });
    }

    async findAvailableSlotsByMentorId(mentor_id: string) {
        console.log('find mentor slots');
        return await this._slotModel.find({ mentorId: mentor_id });
    }

    async findAll(query) {
        const slt = await this._slotModel.find(query);
        if (slt) {
            return slt
        }
        return slt;
    }

    async findMentorId(query) {
        const slt = await this._slotModel.findOne(query);
        if (slt) {
            return slt.toJSON().mentorId
        }
        return null;
    }



    async findFreeSlots(mentor_id: string, package_id: string, time_zone: string) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const availability = require('timeslot-availability');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const moment = require('moment-timezone');
        const free_slots = [];
        let package_time_duration = 15;


        //Get Package details
        const found_package = await this._packageModel.findOne({ packageId: package_id });
        if (!found_package) {
            throw new NotFoundException({ message: 'package not found' });
        }
        if (found_package.packageType == PackageTypes.MINUTES_30) {
            package_time_duration = 30;
        }
        else if (found_package.packageType == PackageTypes.MINUTES_15) {
            package_time_duration = 15;
        }
        else if (found_package.packageType == PackageTypes.HOURS_1) {
            package_time_duration = 60;
        }
        else {
            throw new NotFoundException({ message: 'package type not found' });
        }

        // get busy slots from sessions
        const busySlots = await this._sessionModel.find({ mentorId: mentor_id, status: sessionStatus.UPCOMING });
        const reserved_slots = [];
        for (let idx = 0; idx < busySlots.length; idx++) {
            const slot_busy = busySlots[idx];
            const startObj = moment.tz(slot_busy.startTime.toISOString(), time_zone).format();
            const endObj = moment.tz(slot_busy.endTime.toISOString(), time_zone).format();
            reserved_slots.push(
                { start: startObj, end: endObj }
            );
        }



        const available_slots = await this.findAvailableSlotsByMentorId(mentor_id);
        for (let index = 0; index < available_slots.length; index++) {
            const element = available_slots[index];
            const date_segments = element.availableDate.toISOString().split('T');
            const start = moment.tz(new Date(date_segments[0] + 'T' + element.fromTime).toISOString(), time_zone).format()
            const end = moment.tz(new Date(date_segments[0] + 'T' + element.ToTime).toISOString(), time_zone).format()
            const timespan = package_time_duration * 60;

            const bookable = availability(start, end, timespan, reserved_slots);
            bookable.forEach(bokkable_element => {
                bokkable_element.start = moment.tz(bokkable_element.start, time_zone).format();
                bokkable_element.end = moment.tz(bokkable_element.end, time_zone).format();
                if (free_slots.filter(e => e.start === bokkable_element.start && e.end === bokkable_element.end).length == 0)
                    free_slots.push(bokkable_element);
            });
        }
        return free_slots;
    }
}
