/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
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
        @Param('pageId') pageId: number,
    ) {
        return await this._ReviewsService.findReviews(pageId);
    }
}

