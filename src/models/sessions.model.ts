/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { sessionStatus } from 'src/common/constants';

export const SessionsSchema = new mongoose.Schema({
    sessionId: { type: String, unique: true, required: false },
    mentorId: { type: String, required: false },
    developerId: { type: String, required: false },
    packageId: { type: String, required: false },
    meetingLink: { type: String, required: false },
    eventId: { type: String, required: false },
    bookedDate: { type: String, required: false },
    startTime: { type: Date, required: false },
    endTime: { type: Date, required: false },
    timeZone: { type: String, required: false },
    status: { type: String, enum: [sessionStatus.UPCOMING, sessionStatus.COMPLETED, sessionStatus.CANCELED], required: false },
    paymentStatus:  { type: Number, required: false },
    amount:  { type: Number, required: false },
    currency:  { type: Number, required: false },
    createdAt: { type: Date, default: Date.now, required: false },
    updatedAt: { type: Date, default: Date.now, required: false }
}, { collection: "Sessions" });

export interface ISession {
    sessionId: string;
    mentorId: string;
    developerId: string;
    packageId: string;
    meetingLink: string;
    eventId: string;
    bookedDate: string;
    startTime: Date;
    endTime: Date;
    timeZone: string;
    status: string;
    paymentStatus: number;
    amount: number;
    currency: number;
    createdAt: Date;
    updatedAt: Date;
};