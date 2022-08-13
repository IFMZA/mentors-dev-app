/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { sessionStatus } from 'src/common/constants';

export const SessionsSchema = new mongoose.Schema({
    sessionId: { type: String, unique: true, required: false },
    mentorId: { type: String, required: false },
    packageId: { type: String, required: false },
    meetingLink: { type: String, required: false },
    bookedDate: { type: Date, required: false },
    startTime: { type: Number, required: false },
    endTime: { type: Number, required: false },
    status: { type: String, enum: [sessionStatus.UPCOMING, sessionStatus.COMPLETED, sessionStatus.CANCELED], required: false },
    createdAt: { type: Date, default: Date.now, required: false },
    updatedAt: { type: Date, required: false }
}, { collection: "Sessions" });

export interface ISession {
    sessionId: string;
    mentorId: string;
    packageId: string;
    meetingLink: string;
    bookedDate: Date;
    startTime: number;
    endTime: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};