/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import userRegisterDTO from './DTOs/user.register';
import userLoginDTO from './DTOs/user.login';



@ApiTags('Auth')

@Controller('auth')

export class AuthController {
    constructor(private readonly _authService: AuthService) { }


    //Registration
    @ApiBody({ type: userRegisterDTO })
    @Post('sign-up')
    async register(
        @Body() user_register_dto: userRegisterDTO,
    ) {
        console.log(user_register_dto);
        return await this._authService.register(user_register_dto)
    }

    // validate from email -> update user to be verified = true

    @ApiBody({ type: userLoginDTO })
    @Post('/sign-in')
    async loginBasic(
        @Body() user_login_dto: userLoginDTO
    ) {
        return await this._authService.login(user_login_dto)
    }

    //Login
    //- GOOGLE
    @Post('/google/:access_token:role')
    async loginWithGoogle(
        @Param('access_token') access_token: string,
        @Param('role') role: string
    ) {
        return await this._authService.createUserWithGoogle(access_token, role)
    }

    //- GITHUB
    @Post('/github/:user_name/:role')
    async loginWithGitHub(
        @Param('user_name') user_name: string,
        @Param('role') role: string
    ) {
        return await this._authService.createUserWithGithub(user_name, role);
    }


}

