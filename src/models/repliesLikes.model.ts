/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const RepliesLikesSchema = new mongoose.Schema({
    likeId: { type: String, unique: true, required: false },
    replyId: { type: String, required: false },
    commentId: { type: String, required: false },
    userId: { type: String, required: false },
    createdAt: { type: Date, required: false }
}, { collection: "RepliesLikes" });

export interface IReplyLike {
    likeId: string;
    replyId: string;
    commentId: string;
    userId: string;
    createdAt: Date;
};