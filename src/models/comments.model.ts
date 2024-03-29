/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { AppRoles } from 'src/common/constants';

export const CommentsSchema = new mongoose.Schema({
    commentId: { type: String, unique: true, required: false },
    userId: { type: String, required: false },
    role: { type: String, enum: Object.values(AppRoles), required: false },
    commentText: { type: String, required: false },
    createdAt: { type: Date, required: false },
    isEdited: { type: Boolean, default: false, required: false },
    editedAt: { type: Date, required: false },
    likeCount: { type: Number, default: 0, required: false }
}, { collection: "Comments" });

export interface IComment {
    commentId: string;
    userId: string;
    role: string;
    commentText: string;
    createdAt: Date;
    isEdited: boolean;
    editedAt: Date;
    likeCount: number;
};