/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const ReviewsSchema = new mongoose.Schema({
    reviewId: { type: String, unique: true, required: false },
    mentorId: { type: String, required: false },
    developerId: { type: String, required: false },
    comment: { type: String, required: false },
    starsCount: { type: String, required: false },
    createdAt: { type: Date, required: false }
}, { collection: "Reviews" });

export interface IReview {
    reviewId: string;
    mentorId: string;
    developerId: string;
    comment: string;
    starsCount: string;
    createdAt: Date;
};