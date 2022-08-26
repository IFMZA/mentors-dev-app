/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { REVIEWS_LIST_PAGE_SIZE, REVIEW_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';

import { IReview } from '../models/reviews.model';


import { IToken } from '../models/auth/tokens.model';
import reviewInsertDTO from './DTOs/review.insert';
import reviewUpdateDTO from './DTOs/review.update';

import { generateUUID } from 'src/common/utils/generalUtils';






@Injectable()
export class ReviewsService {
    constructor(@InjectModel(REVIEW_MODEL_NAME) private _reviewModel: Model<IReview>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>) { }

    async createReview(review_insert_dto: reviewInsertDTO) {
        console.log('create review');
        const review_insert = new this._reviewModel({
            reviewId: generateUUID(),
            mentorId: review_insert_dto.mentorId,
            developerId: review_insert_dto.developerId,
            comment: review_insert_dto.comment,
            starsCount: review_insert_dto.starsCount,
            createdAt: Date.now()
        });
        const result = await review_insert.save();
        return result;
    }


    async update(reviewId: string, review_update_dto: reviewUpdateDTO) {
        console.log('update review');
        return await this._reviewModel.findOneAndUpdate({
            reviewId: reviewId
        }, review_update_dto, { upsert: false, new: true });
    }

    async delete(reviewId: string) {
        console.log('delete review');
        return await this._reviewModel.findOneAndDelete({ reviewId: reviewId });
    }

    async findReviews(pageId: number) {
        const _skip = REVIEWS_LIST_PAGE_SIZE * pageId;
        const found_comments = await this._reviewModel.find({}, {}, { skip: _skip, limit: REVIEWS_LIST_PAGE_SIZE }).sort({ createdAt: -1 });
        return found_comments;
    }

}
