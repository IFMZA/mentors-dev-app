/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChatMessagesController } from './chatMessages.controller';
import { ChatMessagesService } from './chatMessages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesSchema } from '../models/chatMessages.model';
import { UsersSchema } from '../models/users.model';
import { TokensSchema } from '../models/auth/tokens.model';


import { MESSAGE_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: MESSAGE_MODEL_NAME, schema: MessagesSchema },
        { name: USER_MODEL_NAME, schema: UsersSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema }
    ])],
    controllers: [ChatMessagesController],
    providers: [ChatMessagesService],
})
export class ChatMessagesModule { }
