/* eslint-disable prettier/prettier */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { REPLY_MODEL_NAME, REPLY_LIKE_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';

import { IReply } from '../models/replies.model';
import { IReplyLike } from '../models/repliesLikes.model';
import { IUser } from '../models/users.model';



import { IToken } from '../models/auth/tokens.model';
import replyInsertDTO from './DTOs/reply.insert';
import replyUpdateDTO from './DTOs/reply.update';

import { generateUUID } from 'src/common/utils/generalUtils';






@Injectable()
export class RepliesService {
    constructor(@InjectModel(REPLY_MODEL_NAME) private _replyModel: Model<IReply>,
        @InjectModel(REPLY_LIKE_MODEL_NAME) private _replyLikeModel: Model<IReplyLike>,
        @InjectModel(USER_MODEL_NAME) private _userModel: Model<IUser>,
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
        const replies_list = [];
        const found_replies = await this._replyModel.find({
            commentId: commentId
        }).sort({ createdAt: -1 });

        for (let idx = 0; idx < found_replies.length; idx++) {
            const replyItem = found_replies[idx];
            let _reply: any = {};
            _reply = JSON.parse(JSON.stringify(replyItem));

            const found_user = await this.findUser({ userId: replyItem.userId });
            if (found_user) {
                _reply.user = {
                    userId: found_user.userId,
                    name: found_user.name,
                    image: found_user.profileImage
                };
            }
            else {
                _reply.user = {
                    userId: '',
                    name: 'anonymous',
                    image: ''
                };
            }
            replies_list.push(_reply);
        }
        return replies_list;
    }


    async likeReply(token: string, replyId: string, commentId: string) {
        console.log('like reply');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        const exist_previous = await this.findOne({ replyId: replyId, commentId: commentId, userId: userId });
        if (exist_previous) {
            throw new ConflictException({ message: 'already liked' });
        }

        await this._replyLikeModel.create({ replyId: replyId, commentId: commentId, likeId: generateUUID(), userId: userId });
        return await this._replyModel.findOneAndUpdate({
            replyId: replyId
        }, { $inc: { likeCount: 1 } }, { upsert: false, new: true });
    }

    async deleteReplyLike(token: string, replyId: string) {
        console.log('delete reply');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        const delete_result = await this._replyLikeModel.findOneAndDelete({ replyId: replyId, userId: userId });
        if (delete_result) {
            return await this._replyModel.findOneAndUpdate({
                replyId: replyId
            }, { $inc: { likeCount: -1 } }, { upsert: false, new: true });
        }
        return delete_result;
    }

    async findUser(query) {
        const user = await this._userModel.findOne(query);
        if (user) {
            return user.toJSON()
        }
        return user;
    }

    async findOne(query) {
        const user = await this._replyLikeModel.findOne(query);
        if (user) {
            return user.toJSON()
        }
        return user;
    }
}
