/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const ReviewsSchema = new mongoose.Schema({
    reviewId: { type: String, unique: true, required: false },
    mentorId: { type: String, required: false },
    developerId: { type: String, required: false },
    sessionId: { type: String, required: false },
    comment: { type: String, required: false },
    starsCount: { type: Number, required: false },
    createdAt: { type: Date, required: false }
}, { collection: "Reviews" });

export interface IReview {
    reviewId: string;
    mentorId: string;
    developerId: string;
    sessionId: string;
    comment: string;
    starsCount: number;
    createdAt: Date;
};