/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { currencies } from 'src/common/constants';

export const PaymentsSchema = new mongoose.Schema({
    paymentId: { type: String, unique: true, required: false },
    sessionId: { type: String, required: false },
    amount: { type: Number, required: false },
    currency: { type: String, required: false },
    mentorId: { type: String, required: false },
    developerId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now, required: false }

}, { collection: "Payments" });

export interface IPayment {
    paymentId: string;
    sessionId: string;
    amount: number;
    currency: string;
    mentorId: string;
    developerId: string;
    createdAt: Date;
};