/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensSchema } from '../models/auth/tokens.model';
import { ReviewsSchema } from '../models/reviews.model';


import { REVIEW_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: REVIEW_MODEL_NAME, schema: ReviewsSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema }
    ])],
    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule { }
