/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensSchema } from '../models/auth/tokens.model';
import { CommentsSchema } from '../models/comments.model';
import { CommentsLikesSchema } from '../models/commentsLikes.model';
import { RepliesSchema } from '../models/replies.model';
import { RepliesLikesSchema } from '../models/repliesLikes.model';
import { UsersSchema } from '../models/users.model';

import {
  COMMENT_LIKE_MODEL_NAME,
  COMMENT_MODEL_NAME,
  REPLY_LIKE_MODEL_NAME,
  REPLY_MODEL_NAME,
  TOKEN_MODEL_NAME,
  USER_MODEL_NAME,
} from 'src/common/constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: COMMENT_MODEL_NAME, schema: CommentsSchema },
      { name: COMMENT_LIKE_MODEL_NAME, schema: CommentsLikesSchema },
      { name: REPLY_MODEL_NAME, schema: RepliesSchema },
      { name: REPLY_LIKE_MODEL_NAME, schema: RepliesLikesSchema },
      { name: TOKEN_MODEL_NAME, schema: TokensSchema },
      { name: USER_MODEL_NAME, schema: UsersSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
