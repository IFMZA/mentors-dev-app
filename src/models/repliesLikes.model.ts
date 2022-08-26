/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { AppRoles } from 'src/common/constants';

export const RepliesLikesSchema = new mongoose.Schema({
    likeId: { type: String, unique: true, required: false },
    replyId: { type: String, required: false },
    userId: { type: String, required: false },
    role: { type: String, enum: [AppRoles.MENTOR, AppRoles.DEVELOPER], required: false },
    createdAt: { type: Date, required: false }
}, { collection: "RepliesLikes" });

export interface IReplyLike {
    likeId: string;
    replyId: string;
    userId: string;
    role: string;
    createdAt: Date;
};