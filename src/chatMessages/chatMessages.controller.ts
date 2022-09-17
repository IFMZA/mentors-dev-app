/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ChatMessagesService } from './chatMessages.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import messageInsertDTO from './DTOs/message.insert';
import messageUpdateDTO from './DTOs/message.update';



@ApiTags('ChatMessages')
@ApiBearerAuth()
@Controller('ChatMessages')

export class ChatMessagesController {
    constructor(private readonly _chatService: ChatMessagesService) { }

    @Post('/create')
    async createMessage(
        @Req() request: Request,
        @Body() message_insert_dto: messageInsertDTO,
    ) {
        return await this._chatService.createMessage(request.headers.authorization.replace('Bearer ', ''), message_insert_dto);
    }

    @Put('/update/:messageId')
    async updateMessage(
        @Param('messageId') messageId: string,
        @Body() message_update_dto: messageUpdateDTO,
    ) {
        return await this._chatService.update(messageId, message_update_dto)
    }

    @Delete('/delete/:messageId')
    async deleteMessage(
        @Param('messageId') messageId: string
    ) {
        return await this._chatService.delete(messageId)
    }

    @Get('/getSelfMessages')
    async getSelfMessages(
        @Req() request: Request,
    ) {
        return await this._chatService.findSelfChatMessages(request.headers.authorization.replace('Bearer ', ''))
    }
}

