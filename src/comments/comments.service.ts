/* eslint-disable prettier/prettier */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { COMMENT_MODEL_NAME, COMMENT_LIKE_MODEL_NAME, TOKEN_MODEL_NAME, COMMENTS_LIST_PAGE_SIZE, REPLY_MODEL_NAME, REPLY_LIKE_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';

import { IComment } from '../models/comments.model';
import { ICommentLike } from '../models/commentsLikes.model';
import { IReply } from '../models/replies.model';
import { IReplyLike } from '../models/repliesLikes.model';
import { IUser } from '../models/users.model';



import { IToken } from '../models/auth/tokens.model';
import commentInsertDTO from './DTOs/comment.insert';
import commentUpdateDTO from './DTOs/comment.update';

import { generateUUID } from 'src/common/utils/generalUtils';






@Injectable()
export class CommentsService {
    constructor(@InjectModel(COMMENT_MODEL_NAME) private _commentModel: Model<IComment>,
        @InjectModel(COMMENT_LIKE_MODEL_NAME) private _likeModel: Model<ICommentLike>,
        @InjectModel(REPLY_MODEL_NAME) private _replyModel: Model<IReply>,
        @InjectModel(REPLY_LIKE_MODEL_NAME) private _replyLikeModel: Model<IReplyLike>,
        @InjectModel(USER_MODEL_NAME) private _userModel: Model<IUser>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>) { }

    async createComment(token: string, comment_insert_dto: commentInsertDTO) {
        console.log('create comment');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;
        const comment_insert = new this._commentModel({
            commentId: generateUUID(),
            userId: userId,
            role: comment_insert_dto.role,
            commentText: comment_insert_dto.commentText,
            createdAt: Date.now()
        });
        const result = await comment_insert.save();
        return result;
    }


    async update(commentId: string, comment_update_dto: commentUpdateDTO) {
        console.log('update comment');
        comment_update_dto["isEdited"] = true;
        comment_update_dto["editedAt"] = Date.now();
        return await this._commentModel.findOneAndUpdate({
            commentId: commentId
        }, comment_update_dto, { upsert: false, new: true });
    }

    async delete(commentId: string) {
        console.log('delete comment');
        const delete_result = await this._commentModel.findOneAndDelete({ commentId: commentId });
        if (delete_result) {
            await this._replyModel.deleteMany({ commentId: commentId });
            await this._replyLikeModel.deleteMany({ commentId: commentId });
            await this._likeModel.deleteMany({ commentId: commentId });
        }
        return delete_result;
    }


    async findComments(pageId: number) {
        const _skip = COMMENTS_LIST_PAGE_SIZE * pageId;
        const found_comments = await this._commentModel.find({}, {}, { skip: _skip, limit: COMMENTS_LIST_PAGE_SIZE }).sort({ createdAt: -1 });
        const unique_comment_ids = [...new Set(found_comments.map(item => item.commentId))];
        const found_replies = await this._replyModel.find({
            commentId: { $in: unique_comment_ids }
        }, {}, { skip: _skip, limit: COMMENTS_LIST_PAGE_SIZE }).sort({ createdAt: -1 });
        found_comments.forEach(comment => {
            const related_replies = found_replies.filter(function(element) { return element.commentId == comment.commentId; })
            comment["replies"] = related_replies;
        });
        for (let idx = 0; idx < found_comments.length; idx++) {
            const commentItem = found_comments[idx];
            const found_user = await this.findUser({ userId: commentItem.userId });
            if (found_user) {
                commentItem['user'] = {
                    name: found_user.name,
                    image: found_user.profileImage
                };
            }
            else {
                commentItem['user'] = {
                    name: 'anonymous',
                    image: ''
                };
            }
        }
        return found_comments;
    }


    async likeComment(token: string, commentId: string) {
        console.log('like comment');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;
        const exist_previous = await this.findOne({ commentId: commentId, userId: userId });
        if (exist_previous) {
            throw new ConflictException({ message: 'already liked' });
        }


        await this._likeModel.create({ commentId: commentId, likeId: generateUUID(), userId: userId });
        return await this._commentModel.findOneAndUpdate({
            commentId: commentId
        }, { $inc: { likeCount: 1 } }, { upsert: false, new: true });
    }


    async deleteLikeComment(token: string, commentId: string) {
        console.log('delete like comment');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        const delete_result = await this._likeModel.findOneAndDelete({ commentId: commentId, userId: userId });
        if (delete_result) {
            return await this._commentModel.findOneAndUpdate({
                commentId: commentId
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
        const user = await this._likeModel.findOne(query);
        if (user) {
            return user.toJSON()
        }
        return user;
    }
}
