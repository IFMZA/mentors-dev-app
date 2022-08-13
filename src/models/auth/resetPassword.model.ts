/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const ResetPasswordSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: false },
    oldPassword: { type: String, unique: true, required: false },
    NewPassword: { type: String, default: false, required: false },
    createdAt: { type: Date, default: Date.now, required: false }
}, { collection: "ResetPasswords" });

export interface IResetPassword {
    userId: string;
    oldPassword: string;
    NewPassword: string;
    createdAt: Date;
};