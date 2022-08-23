/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const MentorAvailableSlotsSchema = new mongoose.Schema({
    slotId: { type: String, unique: true, required: false },
    mentorId: { type: String, required: false },
    availableDate: { type: Date, required: false },
    fromTime: { type: String, required: false },
    ToTime: { type: String, required: false },
    createdAt: { type: String, default: Date.now, required: false }
}, { collection: "MentorAvailableSlots" });

export interface IMentorAvailableSlot {
    slotId: string;
    mentorId: string;
    availableDate: Date;
    fromTime: string;
    ToTime: string;
    createdAt: string;
};