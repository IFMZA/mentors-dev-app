/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { MentorAvailableSlotsService } from './mentorAvailableSlots.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import slotInsertDTO from './DTOs/mentorAvailableSlots.insert';
import slotUpdateDTO from './DTOs/mentorAvailableSlots.update';





@ApiTags('Slots')
@ApiBearerAuth()
@Controller('Slots')

export class MentorAvailableSlotsController {
    constructor(private readonly _SlotsService: MentorAvailableSlotsService) { }

    @Post('/create')
    async createSlot(
        @Req() request: Request,
        @Body() slot_insert_dto: slotInsertDTO,
    ) {
        return await this._SlotsService.createSlot(request.headers.authorization.replace('Bearer ', ''), slot_insert_dto);
    }

    @Post('/createMany')
    async createManySlots(
        @Req() request: Request,
        @Body() slot_insert_dto: [slotInsertDTO],
    ) {
        return await this._SlotsService.createManySlots(request.headers.authorization.replace('Bearer ', ''), slot_insert_dto);
    }

    @Put('/update/:slotId')
    async updateSlot(
        @Param('slotId') slotId: string,
        @Body() slot_update_dto: slotUpdateDTO,
    ) {
        return await this._SlotsService.update(slotId, slot_update_dto)
    }

    @Delete('/delete/:slotId')
    async deleteSlot(
        @Param('slotId') slotId: string
    ) {
        return await this._SlotsService.delete(slotId)
    }

    @Get('/getSelfSlots')
    async getSelfSlots(
        @Req() request: Request,
    ) {
        return await this._SlotsService.findSelfSlots(request.headers.authorization.replace('Bearer ', ''))
    }

    @Get('/getAvailableSlots/:mentorId')
    async getAvailableSlots(
        @Param('mentorId') mentorId: string,
    ) {
        return await this._SlotsService.findAvailableSlotsByMentorId(mentorId);
    }
}

