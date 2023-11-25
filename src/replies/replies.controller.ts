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
import { RepliesService } from './replies.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import replyInsertDTO from './DTOs/reply.insert';
import replyUpdateDTO from './DTOs/reply.update';

@ApiTags('Replies')
@ApiBearerAuth()
@Controller('Replies')
export class RepliesController {
  constructor(private readonly _RepliesService: RepliesService) {}

  @Post('/create')
  async createReply(
    @Req() request: Request,
    @Body() reply_insert_dto: replyInsertDTO,
  ) {
    return await this._RepliesService.createReply(
      request.headers.authorization.replace('Bearer ', ''),
      reply_insert_dto,
    );
  }

  @Put('/update/:replyId')
  async updateReply(
    @Param('replyId') replyId: string,
    @Body() reply_update_dto: replyUpdateDTO,
  ) {
    return await this._RepliesService.update(replyId, reply_update_dto);
  }

  @Delete('/delete/:replyId')
  async deleteReply(@Param('replyId') replyId: string) {
    return await this._RepliesService.delete(replyId);
  }

  @Get('/getReplies/:commentId')
  async getReplies(@Req() req: Request, @Param('commentId') commentId: string) {
    const base_url = `${req.protocol}://${req.get('Host')}/`;
    return await this._RepliesService.findReplies(base_url, commentId);
  }

  @Post('/like/:replyId&:commentId')
  async likeReply(
    @Req() request: Request,
    @Param('replyId') replyId: string,
    @Param('commentId') commentId: string,
  ) {
    return await this._RepliesService.likeReply(
      request.headers.authorization.replace('Bearer ', ''),
      replyId,
      commentId,
    );
  }

  @Delete('/removeLike/:replyId')
  async deleteReplyLike(
    @Req() request: Request,
    @Param('replyId') replyId: string,
  ) {
    return await this._RepliesService.deleteReplyLike(
      request.headers.authorization.replace('Bearer ', ''),
      replyId,
    );
  }
}
