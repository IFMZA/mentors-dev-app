/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { AppRoles } from 'src/common/constants';

export const RepliesSchema = new mongoose.Schema({
    replyId: { type: String, unique: true, required: false },
    commentId: { type: String, required: false },
    userId: { type: String, required: false },
    role: { type: String, enum: [AppRoles.MENTOR, AppRoles.DEVELOPER], required: false },
    replyText: { type: String, required: false },
    createdAt: { type: Date, required: false },
    isEdited: { type: Boolean, default: false, required: false },
    editedAt: { type: Date, required: false },
    likeCount: { type: Number, default: 0, required: false }
}, { collection: "Replies" });

export interface IReply {
    replyId: string;
    commentId: string;
    userId: string;
    userType: string;
    replyTexxt: string;
    createdAt: Date;
    isEdited: boolean;
    editedAt: Date;
    likeCount: boolean;
};