/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const CommentsSchema = new mongoose.Schema({
    commentId: { type: String, unique: true, required: false },
    sessionId: { type: String, required: false },
    developerId: { type: String, required: false },
    commentText: { type: String, required: false },
    createdAt: { type: Date, required: false },
    isEdited: { type: Boolean, default: false, required: false },
    editedAt: { type: Date, required: false },
    likeCount: { type: Number, default: 0, required: false }
}, { collection: "Comments" });

export interface IComment {
    commentId: string;
    sessionId: string;
    developerId: string;
    commentText: string;
    createdAt: Date;
    isEdited: boolean;
    editedAt: Date;
    likeCount: boolean;
};