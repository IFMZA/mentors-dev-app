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

    // @Put('/update/:packageId')
    // async updatePackage(
    //     @Param('packageId') packageId: string,
    //     @Body() package_update_dto: packageUpdateDTO,
    // ) {
    //     return await this._packagesService.update(packageId, package_update_dto)
    // }

    // @Delete('/delete/:packageId')
    // async deletePackage(
    //     @Param('packageId') packageId: string
    // ) {
    //     return await this._packagesService.delete(packageId)
    // }

    // @Get('/getSelfPackages')
    // async getSelfPackages(
    //     @Req() request: Request,
    // ) {
    //     return await this._packagesService.findSelfPackages(request.headers.authorization.replace('Bearer ', ''))
    // }

    // @Get('/getPackages/:mentorId')
    // async getPackages(
    //     @Param('mentorId') mentorId: string,
    // ) {
    //     return await this._packagesService.findByMentorId(mentorId);
    // }
}

