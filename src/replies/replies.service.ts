/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { REPLY_MODEL_NAME, REPLY_LIKE_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';

import { IReply } from '../models/replies.model';
import { IReplyLike } from '../models/repliesLikes.model';


import { IToken } from '../models/auth/tokens.model';
import replyInsertDTO from './DTOs/reply.insert';
import replyUpdateDTO from './DTOs/reply.update';

import { generateUUID } from 'src/common/utils/generalUtils';






@Injectable()
export class RepliesService {
    constructor(@InjectModel(REPLY_MODEL_NAME) private _replyModel: Model<IReply>,
        @InjectModel(REPLY_LIKE_MODEL_NAME) private _replyLikeModel: Model<IReplyLike>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>) { }

    async createReply(token: string, reply_insert_dto: replyInsertDTO) {
        console.log('create reply');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;
        const reply_insert = new this._replyModel({
            replyId: generateUUID(),
            commentId: reply_insert_dto.commentId,
            userId: userId,
            role: reply_insert_dto.role,
            replyText: reply_insert_dto.replyText,
            createdAt: Date.now()
        });
        const result = await reply_insert.save();
        return result;
    }


    async update(replyId: string, reply_update_dto: replyUpdateDTO) {
        console.log('update reply');
        return await this._replyModel.findOneAndUpdate({
            replyId: replyId
        }, reply_update_dto, { upsert: false, new: true });
    }

    async delete(replyId: string) {
        console.log('delete reply');
        const delete_result = await this._replyModel.findOneAndDelete({ replyId: replyId });
        if (delete_result) {
            await this._replyModel.deleteMany({ replyId: replyId });
            await this._replyLikeModel.deleteMany({ replyId: replyId });
        }
        return delete_result;
    }


    async findReplies(commentId: string) {
        const found_replies = await this._replyModel.find({
            commentId: commentId
        }).sort({ createdAt: -1 });
        return found_replies;
    }


    async likeReply(token: string, replyId: string, commentId: string) {
        console.log('like reply');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        await this._replyLikeModel.create({ replyId: replyId, commentId: commentId, likeId: generateUUID(), userId: userId });
        return await this._replyModel.findOneAndUpdate({
            replyId: replyId
        }, { $inc: { likeCount: 1 } }, { upsert: false, new: true });
    }
}
