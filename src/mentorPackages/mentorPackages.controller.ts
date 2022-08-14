/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { MentorPackagesService } from './mentorPackages.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import packageInsertDTO from './DTOs/package.insert';
import packageUpdateDTO from './DTOs/package.update';



@ApiTags('Packages')
@ApiBearerAuth()
@Controller('Packages')

export class MentorPackagesController {
    constructor(private readonly _packagesService: MentorPackagesService) { }

    @Post('/create')
    async createPackage(
        @Req() request: Request,
        @Body() package_insert_dto: packageInsertDTO,
    ) {
        return await this._packagesService.createPackage(request.headers.authorization.replace('Bearer ', ''), package_insert_dto);
    }

    @Put('/update/:packageId')
    async updatePackage(
        @Param('packageId') packageId: string,
        @Body() package_update_dto: packageUpdateDTO,
    ) {
        return await this._packagesService.update(packageId, package_update_dto)
    }

    @Delete('/delete/:packageId')
    async deletePackage(
        @Param('packageId') packageId: string
    ) {
        return await this._packagesService.delete(packageId)
    }

    @Get('/getSelfPackages')
    async getSelfPackages(
        @Req() request: Request,
    ) {
        return await this._packagesService.findSelfPackages(request.headers.authorization.replace('Bearer ', ''))
    }

    @Get('/getPackages/:mentorId')
    async getPackages(
        @Param('mentorId') mentorId: string,
    ) {
        return await this._packagesService.findByMentorId(mentorId);
    }
}

