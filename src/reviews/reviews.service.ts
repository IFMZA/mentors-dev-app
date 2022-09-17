/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { REVIEWS_LIST_PAGE_SIZE, REVIEW_MODEL_NAME, SESSION_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';

import { IReview } from '../models/reviews.model';

import { IUser } from '../models/users.model';
import { ISession } from '../models/sessions.model';




import { IToken } from '../models/auth/tokens.model';
import reviewInsertDTO from './DTOs/review.insert';
import reviewUpdateDTO from './DTOs/review.update';

import { generateUUID } from 'src/common/utils/generalUtils';






@Injectable()
export class ReviewsService {
    constructor(@InjectModel(REVIEW_MODEL_NAME) private _reviewModel: Model<IReview>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>,
        @InjectModel(USER_MODEL_NAME) private _userModel: Model<IUser>,
        @InjectModel(SESSION_MODEL_NAME) private _sessionModel: Model<ISession>) { }

    async createReview(review_insert_dto: reviewInsertDTO) {
        console.log('create review');
        if (!await this.validate_userId(review_insert_dto.mentorId))
            throw new NotFoundException({ message: 'mentor not found' });
        if (!await this.validate_userId(review_insert_dto.developerId))
            throw new NotFoundException({ message: 'developer not found' });
        if (!await this.validate_sessionId(review_insert_dto.sessionId))
            throw new NotFoundException({ message: 'session not found' });

        const review_insert = new this._reviewModel({
            reviewId: generateUUID(),
            mentorId: review_insert_dto.mentorId,
            developerId: review_insert_dto.developerId,
            sessionId: review_insert_dto.sessionId,
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
        const found_reviews = await this._reviewModel.find({}, {}, { skip: _skip, limit: REVIEWS_LIST_PAGE_SIZE }).sort({ createdAt: -1 });


        const reviews_list = [];
        for (let idx = 0; idx < found_reviews.length; idx++) {
            // eslint-disable-next-line prefer-const
            let reviewItem = found_reviews[idx];
            let _review: any = {};
            _review = JSON.parse(JSON.stringify(reviewItem));
            //Get User Details For Review
            const found_user = await this.findUser({ userId: _review.developerId });
            if (found_user)
                _review.user = { userId: found_user.userId, name: found_user.name, image: found_user.profileImage };
            else
                _review.user = { userId: '', name: 'anonymous', image: '' };

            reviews_list.push(_review);
        }
        return reviews_list;
    }


    async findSelfReviews(token: string, pageId: number) {
        const _skip = REVIEWS_LIST_PAGE_SIZE * pageId;

        const query = {};
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        query["$or"] = [
            { mentorId: userId },
            { developerId: userId }
        ];

        const found_reviews = await this._reviewModel.find(query, {}, { skip: _skip, limit: REVIEWS_LIST_PAGE_SIZE }).sort({ createdAt: -1 });
        return found_reviews;
    }

    async findReviewsByMentorId(mentorId: string, pageId: number) {
        const _skip = REVIEWS_LIST_PAGE_SIZE * pageId;
        const found_reviews = await this._reviewModel.find({ mentorId: mentorId }, {}, { skip: _skip, limit: REVIEWS_LIST_PAGE_SIZE }).sort({ createdAt: -1 });
        return found_reviews;
    }



    async findUser(query) {
        const user = await this._userModel.findOne(query);
        if (user) {
            return user.toJSON()
        }
        return user;
    }
    //validators
    async validate_userId(user_id: string) {
        let valid = true;
        const found_user = await this._userModel.findOne({ userId: user_id });
        if (!found_user) { valid = false; }
        return valid;
    }
    async validate_sessionId(session_id: string) {
        let valid = true;
        const found_session = await this._sessionModel.findOne({ sessionId: session_id });
        if (!found_session) { valid = false; }
        return valid;
    }

}
