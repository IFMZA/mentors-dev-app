/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const RegistrationVerificationSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: false },
    email: { type: String, unique: true, required: false },
    verificationCode: { type: String, unique: true, required: false },
    isConfirmed: { type: Boolean, default: false, required: false },
    updatedAt: { type: Date, default: Date.now, required: false }
}, { collection: "RegistrationVerifications" });

export interface IRegistrationVerification {
    userId: string;
    email: string;
    verificationCode: string;
    isConfirmed: boolean;
    updatedAt: Date;
};