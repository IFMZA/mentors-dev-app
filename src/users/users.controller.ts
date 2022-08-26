/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */

import { Body, Controller, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import reset_password_update_dto from './DTOs/reset.password.update';
import verify_password_update_dto from 'src/forgot-password/DTOs/verify-password.update';
import userUpdateDTO from './DTOs/user.update';
import { Request, Response } from 'express';
import mentor_filter_dto from './DTOs/mentor.filter';



@ApiTags('Users')
@ApiBearerAuth()
@Controller('Users')

export class UsersController {
    constructor(private readonly _usersService: UsersService) { }


    @Post('/reset-password')
    async resetPassword(
        @Body() reset_password_dto: reset_password_update_dto,
    ) {
        return await this._usersService.resetPassword(
            reset_password_dto.email,
            reset_password_dto.oldPassword,
            reset_password_dto.newPassword);
    }

    @Get('/test')
    async test(
    ) {

        // var date = "2022-08-22";
        // var time = "11:30";
        // var duration = 45;

        // var start = date + "T" + time;
        // var start_date = new Date(start);
        // var end_date = new Date(start_date.getTime() + duration * 60000)

        // console.log('start')
        // console.log(start_date)
        // console.log('end')
        // console.log(end_date)

        // await delete_session_meeting("2hc3kumdkull1813dqe22r170o");


        var moment = require('moment-timezone');

        // var newDateObj = moment(start).toDate();
        // var newDateObj = moment.tz(start, "Africa/Cairo").format();
        // console.log('start')
        // console.log(new Date(newDateObj));

        // var newDateObj = moment.tz(start, "Africa/Cairo").add(45, 'm').format();
        // console.log('start')
        // console.log(new Date(newDateObj));


        var a = moment.utc("2022-08-22T07:15:00Z").tz("Africa/Cairo");
        // var a = moment.tz("2022-08-23T09:00:30Z", "Australia/Perth");
        // var b = a.clone().tz('Australia/Perth')
        return a.format();
    }

    @Get('/verify/:email&:verify_code')
    async verifyCode(
        @Param('email') email: string,
        @Param('verify_code') verify_code: string,
        @Res() res: Response
    ) {
        const verify_password_dto = new verify_password_update_dto();
        verify_password_dto.email = email;
        verify_password_dto.verificationCode = verify_code;
        const role = await this._usersService.verifyCode(verify_password_dto);
        return res.redirect(`http://localhost:3000/new/${role}`);
    }

    @Put('/update')
    async updateUser(
        @Req() request: Request,
        @Body() user_update_dto: userUpdateDTO,
    ) {
        return await this._usersService.updateUser(request.headers.authorization.replace('Bearer ', ''), user_update_dto)
    }

    @Get('/getMentorById/:mentor_id')
    async getMentorById(
        @Param('mentor_id') mentor_id: string
    ) {
        return await this._usersService.getMentorById(mentor_id);
    }

    @Get('/getMentors')
    async getMentors(
        @Query() mentor_filter: mentor_filter_dto
    ) {
        console.log(mentor_filter)
        return await this._usersService.getMentorsByFilterSort(mentor_filter);
    }

}

