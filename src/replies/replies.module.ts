/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensSchema } from '../models/auth/tokens.model';
import { RepliesSchema } from '../models/replies.model';
import { RepliesLikesSchema } from '../models/repliesLikes.model';

import { UsersSchema } from '../models/users.model';



import { REPLY_LIKE_MODEL_NAME, REPLY_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: REPLY_MODEL_NAME, schema: RepliesSchema },
        { name: REPLY_LIKE_MODEL_NAME, schema: RepliesLikesSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema },
        { name: USER_MODEL_NAME, schema: UsersSchema }

    ])],
    controllers: [RepliesController],
    providers: [RepliesService],
})
export class RepliesModule { }
