/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import sessionInsertDTO from './DTOs/session.insert';
import sessionUpdateDTO from './DTOs/session.update';



@ApiTags('Sessions')
@ApiBearerAuth()
@Controller('Sessions')

export class SessionsController {
    constructor(private readonly _sessionsService: SessionsService) { }

    @Post('/create')
    async createSession(
        @Req() request: Request,
        @Body() session_insert_dto: sessionInsertDTO,
    ) {
        return await this._sessionsService.createSession(request.headers.authorization.replace('Bearer ', ''), session_insert_dto);
    }

    @Put('/update/:sessionId')
    async updateSession(
        @Param('sessionId') sessionId: string,
        @Body() session_update_dto: sessionUpdateDTO,
    ) {
        return await this._sessionsService.update(sessionId, session_update_dto)
    }

    @Delete('/delete/:sessionId')
    async deleteSession(
        @Param('sessionId') sessionId: string
    ) {
        return await this._sessionsService.delete(sessionId)
    }

    @Get('/getSessions/:mentorId')
    async getMentorSessions(
        @Param('mentorId') mentorId: string,
    ) {
        return await this._sessionsService.findByMentorId(mentorId);
    }

    @Get('/getSessions/:developerId')
    async getDeveloperSessions(
        @Param('developerId') developerId: string,
    ) {
        return await this._sessionsService.findByDeveloperId(developerId);
    }
}

