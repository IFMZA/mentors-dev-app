/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const MentorAvailableSlotsSchema = new mongoose.Schema({
    slotId: { type: String, unique: true, required: false },
    mentorId: { type: String, required: false },
    availableDate: { type: Date, required: false },
    fromTime: { type: Number, required: false },
    ToTime: { type: Number, required: false },
    createdAt: { type: String, default: Date.now, required: false }
}, { collection: "MentorAvailableSlots" });

export interface IMentorAvailableSlot {
    packageId: string;
    mentorId: string;
    packageType: string;
    price: number;
    currency: string;
    features: string[];
    updatedAt: Date;
};