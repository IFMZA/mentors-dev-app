/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import reset_password_update_dto from './DTOs/reset.password.update';
import verify_password_update_dto from 'src/forgot-password/DTOs/verify-password.update';



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

    @Post('/verify')
    async verifyCode(
        @Body() verify_password_dto: verify_password_update_dto,
    ) {
        return await this._usersService.verifyCode(verify_password_dto)
    }

}

