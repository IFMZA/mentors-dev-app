/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */

import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import reset_password_update_dto from './DTOs/reset.password.update';
import verify_password_update_dto from 'src/forgot-password/DTOs/verify-password.update';
import userUpdateDTO from './DTOs/user.update';
import { Request, Response } from 'express';
import mentor_filter_dto from './DTOs/mentor.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path/posix';



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



        const availability = require('timeslot-availability');

        const start = new Date('2019-08-08T08:00:00.000Z');
        const end = new Date('2019-08-08T16:00:00.000Z');
        const timespan = 30 * 60; // 30 minutes

        const siestas = [
            {
                start: '2019-08-08T09:00:00.000Z',
                end: '2019-08-08T12:00:00.000Z',
            },
            {
                start: '2019-08-08T10:00:00.000Z',
                end: '2019-08-08T12:00:00.000Z',
            },
            {
                start: '2019-08-08T13:00:00.000Z',
                end: '2019-08-08T14:00:00.000Z',
            },
        ];

        const bookable = availability(start, end, timespan, siestas);

        console.log(bookable);




        // var _dateNewStart = new Date("2022-08-29 10:01");
        // // var _dateNewEnd = new Date("2022-08-29 09:00");


        // var _startdate = new Date("2022-08-29 22:00");
        // var _enddate = new Date("2022-08-29 23:00");

        // if (_dateNewStart >= _startdate && _dateNewStart <= _enddate) {
        //     return "Not valid"
        // }


        return "valid"

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


        // var moment = require('moment-timezone');

        // var newDateObj = moment(start).toDate();
        // var newDateObj = moment.tz(start, "Africa/Cairo").format();
        // console.log('start')
        // console.log(new Date(newDateObj));

        // var newDateObj = moment.tz(start, "Africa/Cairo").add(45, 'm').format();
        // console.log('start')
        // console.log(new Date(newDateObj));


        // var a = moment.utc("2022-08-22T07:15:00Z").tz("Africa/Cairo");
        // var a = moment.tz("2022-08-23T09:00:30Z", "Australia/Perth");
        // var b = a.clone().tz('Australia/Perth')
        //a.format();
        // return _date;
    }


    // @Put('file')
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({
    //         destination: './files',
    //         filename: (req, file, callback) => {
    //             const unique_suff = Date.now() + "-" + Math.round(Math.random() * 1e9);
    //             const file_name = unique_suff + extname(file.originalname);
    //             callback(null, file_name);
    //         }
    //     })
    // }))
    // async uploadFile(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body() user_update_dto: userUpdateDTO
    // ) {
    //     console.log('file', file);
    //     console.log(user_update_dto)
    //     return 'file Upload'
    // }

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

    @ApiConsumes('multipart/form-data')
    @Put('/update')
    @UseInterceptors(FileInterceptor('profileImage', {
        storage: diskStorage({
            destination: './files',
            filename: (req, file, callback) => {
                const unique_suff = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const file_name = unique_suff + extname(file.originalname);
                callback(null, file_name);
            }
        })
    }))
    async updateUser(
        @Req() request: Request,
        @Body() user_update_dto: userUpdateDTO,
        @UploadedFile() profileImage: Express.Multer.File
    ) {
        console.log(profileImage)
        const base_url = `${request.protocol}://${request.get('Host')}/`;
        if (profileImage) { user_update_dto.profileImage = profileImage.path.replace("\\", "/"); }
        return await this._usersService.updateUser(request.headers.authorization.replace('Bearer ', ''), user_update_dto, base_url)
    }

    @Get('/getMentorById/:mentor_id')
    async getMentorById(
        @Req() request: Request,
        @Param('mentor_id') mentor_id: string
    ) {
        const base_url = `${request.protocol}://${request.get('Host')}/`;
        return await this._usersService.getMentorById(base_url, mentor_id);
    }

    @Get('/getDeveloperById/:developer_id')
    async getDeveloperById(
        @Req() request: Request,
        @Param('developer_id') developer_id: string
    ) {
        const base_url = `${request.protocol}://${request.get('Host')}/`;
        return await this._usersService.getDeveloperById(base_url, developer_id);
    }

    @Get('/getMentors')
    async getMentors(
        @Req() req: Request,
        @Query() mentor_filter: mentor_filter_dto
    ) {
        console.log(mentor_filter)
        const base_url = `${req.protocol}://${req.get('Host')}/`;
        return await this._usersService.getMentorsByFilterSort(base_url, mentor_filter);
    }

}

