/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { AppRoles } from 'src/common/constants';

export const CommentsLikesSchema = new mongoose.Schema({
    likeId: { type: String, unique: true, required: false },
    commentId: { type: String, required: false },
    userId: { type: String, required: false },
    role: { type: String, enum: [AppRoles.MENTOR, AppRoles.DEVELOPER], required: false },
    createdAt: { type: Date, required: false }
}, { collection: "CommentsLikes" });

export interface ICommentLike {
    likeId: string;
    commentId: string;
    userId: string;
    role: string;
    createdAt: Date;
};