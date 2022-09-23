/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { MentorAvailableSlotsService } from './mentorAvailableSlots.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import slotInsertDTO from './DTOs/mentorAvailableSlots.insert';
import slotUpdateDTO from './DTOs/mentorAvailableSlots.update';
import slotSaveManyDTO from './DTOs/mentorAvailableSlots.many';
import freeSlotGetDTO from './DTOs/freeSlots.get';





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

    @ApiBody({ type: [slotInsertDTO] })
    @Post('/createMany')
    async createManySlots(
        @Body() slot_insert_dto: [slotInsertDTO],
        @Req() request: Request,
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

    @ApiBody({ type: [slotSaveManyDTO] })
    @Post('/saveManySlots')
    async saveManySlots(
        @Req() request: Request,
        @Body() slot_insert_dto: [slotSaveManyDTO],
    ) {
        return await this._SlotsService.saveManySlots(request.headers.authorization.replace('Bearer ', ''), slot_insert_dto);
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
        @Req() req: Request,
        @Param('mentorId') mentorId: string,
    ) {
        console.log(`${req.protocol}://${req.get('Host')}`);
        return await this._SlotsService.findAvailableSlotsByMentorId(mentorId);
    }


    // @ApiQuery({type: freeSlotGetDTO})
    @Get('/getFreeSlots')
    async getFreeSlots(
        @Req() request: Request,
        @Query() free_slot_options: freeSlotGetDTO
    ) {
        // const mentor_id = "ff5146c3-46ec-4987-b0ce-46b92c231417";
        // const package_id = "b284dd5f-f715-4032-8ddf-683e897af899";
        // const time_zone = "Africa/Cairo";
        return await this._SlotsService.findFreeSlots(free_slot_options.mentor_id, free_slot_options.package_id, free_slot_options.time_zone)
    }
}

