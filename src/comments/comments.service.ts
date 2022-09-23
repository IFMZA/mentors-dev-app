/* eslint-disable prettier/prettier */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { COMMENT_MODEL_NAME, COMMENT_LIKE_MODEL_NAME, TOKEN_MODEL_NAME, COMMENTS_LIST_PAGE_SIZE, REPLY_MODEL_NAME, REPLY_LIKE_MODEL_NAME, USER_MODEL_NAME, AppRoles, AuthMethods } from 'src/common/constants';

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


    async findComments(base_url: string, pageId: number) {
        const comments_list = [];
        const _skip = COMMENTS_LIST_PAGE_SIZE * pageId;
        const found_comments = await this._commentModel.find({}, {}, { skip: _skip, limit: COMMENTS_LIST_PAGE_SIZE }).sort({ createdAt: -1 });
        const unique_comment_ids = [...new Set(found_comments.map(item => item.commentId))];
        const found_replies = await this._replyModel.find({
            commentId: { $in: unique_comment_ids }
        }, {}, { skip: _skip, limit: COMMENTS_LIST_PAGE_SIZE }).sort({ createdAt: -1 });


        found_comments.forEach(comment => {
            let _comment: any = {};
            _comment = JSON.parse(JSON.stringify(comment));
            const related_replies = found_replies.filter(function(element) { return element.commentId == comment.commentId; })
            _comment.replies = related_replies;
            comments_list.push(_comment);
        });

        for (let idx = 0; idx < comments_list.length; idx++) {
            // eslint-disable-next-line prefer-const
            let commentItem = comments_list[idx];
            //Get User Details For Comment
            const found_user = await this.findUser({ userId: commentItem.userId });
            if (found_user)
                commentItem.user = { userId: found_user.userId, name: found_user.name, image: found_user.authMethod == AuthMethods.LOCAL ? base_url + found_user.profileImage : found_user.profileImage };
            else
                commentItem.user = { userId: '', name: 'anonymous', image: '' };

            //Get User Details For Reply
            const new_replies = [];
            for (let idx_ = 0; idx_ < commentItem.replies.length; idx_++) {
                const reply_item = commentItem.replies[idx_];
                let _reply: any = {};
                _reply = JSON.parse(JSON.stringify(reply_item));
                const found_user_reply = await this.findUser({ userId: commentItem.userId });
                if (found_user_reply)
                    _reply.user = { userId: found_user_reply.userId, name: found_user_reply.name, image: found_user_reply.authMethod == AuthMethods.LOCAL ? base_url + found_user_reply.profileImage : found_user_reply.profileImage };
                else
                    _reply.user = { userId: '', name: 'anonymous', image: '' };
                new_replies.push(_reply);
            }
            commentItem.replies = new_replies;
        }
        return comments_list;
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
