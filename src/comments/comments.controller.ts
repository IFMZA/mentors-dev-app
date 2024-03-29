/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import commentInsertDTO from './DTOs/comment.insert';
import commentUpdateDTO from './DTOs/comment.update';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('Comments')
export class CommentsController {
  constructor(private readonly _CommentsService: CommentsService) {}

  @Post('/create')
  async createComment(
    @Req() request: Request,
    @Body() comment_insert_dto: commentInsertDTO,
  ) {
    const base_url = `${request.protocol}://${request.get('Host')}/`;
    return await this._CommentsService.createComment(
      base_url,
      request.headers.authorization.replace('Bearer ', ''),
      comment_insert_dto,
    );
  }

  @Put('/update/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() comment_update_dto: commentUpdateDTO,
  ) {
    return await this._CommentsService.update(commentId, comment_update_dto);
  }

  @Delete('/delete/:commentId')
  async deleteComment(@Param('commentId') commentId: string) {
    return await this._CommentsService.delete(commentId);
  }

  @Get('/getComments/:pageId')
  async getComments(@Req() req: Request, @Param('pageId') pageId: number) {
    const base_url = `${req.protocol}://${req.get('Host')}/`;
    return await this._CommentsService.findComments(base_url, pageId);
  }

  @Post('/like/:commentId')
  async likeComment(
    @Req() request: Request,
    @Param('commentId') commentId: string,
  ) {
    return await this._CommentsService.likeComment(
      request.headers.authorization.replace('Bearer ', ''),
      commentId,
    );
  }

  @Delete('/removeLike/:commentId')
  async deleteCommentLike(
    @Req() request: Request,
    @Param('commentId') commentId: string,
  ) {
    return await this._CommentsService.deleteLikeComment(
      request.headers.authorization.replace('Bearer ', ''),
      commentId,
    );
  }
}
