/* eslint-disable prettier/prettier */
import { Body, Controller, Headers, Post } from '@nestjs/common';
import {  ApiTags } from '@nestjs/swagger';
import create_new_password_update_dto from './DTOs/create-new-password.update';
import forgot_password_insert_dto from './DTOs/forgot-password.insert';
import verify_password_update_dto from './DTOs/verify-password.update';
import { ForgotPasswordService } from './forgot-password.service';


@ApiTags('ForgotPassword')
@Controller('/forgot-password')
export class ForgotPasswordController {

    constructor(private readonly _forgotPasswordService: ForgotPasswordService) { }


    @Post('/')
    async forgetPassword(
        @Body() forgot_password_dto: forgot_password_insert_dto,
        @Headers('accept-language') acceptLanguage: string
    ) {
        return await this._forgotPasswordService.forgetPassword(forgot_password_dto)
    }

    @Post('/verify')
    async verifyCode(
        @Body() verify_password_dto: verify_password_update_dto,
    ) {
        return await this._forgotPasswordService.verifyCode(verify_password_dto)
    }

    @Post('/new-password')
    async createNewPassword(
        @Body() create_new_password_dto: create_new_password_update_dto,
    ) {
        return await this._forgotPasswordService.createNewPassword(create_new_password_dto)
    }
}
