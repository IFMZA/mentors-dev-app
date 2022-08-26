/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MENTOR_AVAILABLE_SLOT_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';

import { IMentorAvailableSlot } from '../models/mentorAvailableSlots.model';
import { IToken } from '../models/auth/tokens.model';
import { generateUUID } from 'src/common/utils/generalUtils';
import slotInsertDTO from './DTOs/mentorAvailableSlots.insert';
import slotUpdateDTO from './DTOs/mentorAvailableSlots.update';
import slotSaveManyDTO from './DTOs/mentorAvailableSlots.many';
import { OpTypes } from './DTOs/saveMany.operation.types';






@Injectable()
export class MentorAvailableSlotsService {
    constructor(@InjectModel(MENTOR_AVAILABLE_SLOT_MODEL_NAME) private _slotModel: Model<IMentorAvailableSlot>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>) { }

    async createSlot(token: string, slot_insert_dto: slotInsertDTO) {
        console.log('create slot');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;
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

    async createManySlots(token: string, slot_list_insert_dto: [slotInsertDTO]) {
        console.log('create many slot');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        const slots_list_to_insert = [];
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
        const delete_list_response = [];
        slot_list_dto.filter(function(element) { return element.opType == OpTypes.DELETED })
            .forEach(async slot_delete_dto => {
                const delete_response = await this._slotModel.findOneAndDelete({ slotId: slot_delete_dto.slotId });
                delete_list_response.push(delete_response);
            });

        return {
            ...insert_list_response,
            ...update_list_response,
            ...delete_list_response
        };
    }


    async update(slotId: string, slot_update_dto: slotUpdateDTO) {
        console.log('update package');
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
}
