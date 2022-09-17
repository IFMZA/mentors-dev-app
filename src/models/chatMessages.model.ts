/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const MessagesSchema = new mongoose.Schema({
    messageId: { type: String, unique: true, required: false },
    messageBody: { type: String, required: false },
    from_id: { type: String, required: false },
    to_id: { type: String, required: false },
    isEdited: { type: Boolean, default: false, required: false },
    createdAt: { type: Date, default: Date.now, required: false },
    updatedAt: { type: Date, default: Date.now, required: false }
}, { collection: "ChatMessages" });

export interface IMessage {
    messageId: string;
    messageBody: string;
    from_id: string;
    to_id: string;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
};