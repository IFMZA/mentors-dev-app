/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MESSAGE_MODEL_NAME,
  TOKEN_MODEL_NAME,
  USER_MODEL_NAME,
} from 'src/common/constants';

import { IMessage } from '../models/chatMessages.model';
import { IUser } from '../models/users.model';

import { IToken } from '../models/auth/tokens.model';
import messageInsertDTO from './DTOs/message.insert';
import { generateUUID } from 'src/common/utils/generalUtils';
import messageUpdateDTO from './DTOs/message.update';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectModel(MESSAGE_MODEL_NAME) private _chatModel: Model<IMessage>,
    @InjectModel(USER_MODEL_NAME) private _userModel: Model<IUser>,
    @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>,
  ) {}

  async createMessage(token: string, message_insert_dto: messageInsertDTO) {
    let userId = '';
    // get user id from token
    const foundToken = await this._tokenModel.findOne({ token: token });
    userId = foundToken.userId;

    const message_insert = new this._chatModel({
      messageId: generateUUID(),
      messageBody: message_insert_dto.messageBody,
      from_id: message_insert_dto.from_id,
      to_id: message_insert_dto.to_id,
    });
    const result = await message_insert.save();
    return result;
  }

  async update(messageId: string, message_update_dto: messageUpdateDTO) {
    return await this._chatModel.findOneAndUpdate(
      {
        messageId: messageId,
      },
      message_update_dto,
      { upsert: false, new: true },
    );
  }

  async delete(messageId: string) {
    return await this._chatModel.findOneAndDelete({ messageId: messageId });
  }

  async findSelfChatMessages(token: string) {
    let userId = '';
    // get user id from token
    const foundToken = await this._tokenModel.findOne({ token: token });
    userId = foundToken.userId;

    const query = {};
    query['$or'] = [{ to_id: userId }, { from_id: userId }];
    const found_messages = await this._chatModel
      .find(query)
      .sort({ createdAt: -1 });

    return found_messages;
  }
}
