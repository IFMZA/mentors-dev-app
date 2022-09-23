/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import reviewInsertDTO from './DTOs/review.insert';
import reviewUpdateDTO from './DTOs/review.update';



@ApiTags('Reviews')
@ApiBearerAuth()
@Controller('Reviews')

export class ReviewsController {
    constructor(private readonly _ReviewsService: ReviewsService) { }

    @Post('/create')
    async createReview(
        @Body() review_insert_dto: reviewInsertDTO,
    ) {
        return await this._ReviewsService.createReview(review_insert_dto);
    }

    @Put('/update/:reviewId')
    async updateReview(
        @Param('reviewId') reviewId: string,
        @Body() review_update_dto: reviewUpdateDTO,
    ) {
        return await this._ReviewsService.update(reviewId, review_update_dto)
    }

    @Delete('/delete/:reviewId')
    async deleteReview(
        @Param('reviewId') reviewId: string
    ) {
        return await this._ReviewsService.delete(reviewId)
    }


    @Get('/getReviews/:pageId')
    async getReviews(
        @Req() req: Request,
        @Param('pageId') pageId: number,
    ) {
        const base_url = `${req.protocol}://${req.get('Host')}/`;
        return await this._ReviewsService.findReviews(base_url, pageId);
    }


    @Get('/getSelfReviews/:pageId')
    async getSelfReviews(
        @Req() request: Request,
        @Param('pageId') pageId: number,
    ) {
        return await this._ReviewsService.findSelfReviews(request.headers.authorization.replace('Bearer ', ''), pageId);
    }


    @Get('/getReviews/:mentorId&:pageId')
    async getReviewsByMentorId(
        @Param('pageId') pageId: number,
        @Param('mentorId') mentorId: string,
    ) {
        return await this._ReviewsService.findReviewsByMentorId(mentorId, pageId);
    }
}

