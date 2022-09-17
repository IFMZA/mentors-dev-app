/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensSchema } from '../models/auth/tokens.model';
import { ReviewsSchema } from '../models/reviews.model';

import { UsersSchema } from '../models/users.model';
import { SessionsSchema } from '../models/sessions.model';



import { REVIEW_MODEL_NAME, SESSION_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: REVIEW_MODEL_NAME, schema: ReviewsSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema },
        { name: USER_MODEL_NAME, schema: UsersSchema },
        { name: SESSION_MODEL_NAME, schema: SessionsSchema }
    ])],
    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule { }
