/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import userRegisterDTO from './DTOs/user.register';
import userLoginDTO from './DTOs/user.login';
import googleAuthDTO from './DTOs/google.auth';



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
    @ApiBody({ type: googleAuthDTO })
    @Post('/google')
    async loginWithGoogle(
        @Body() google_auth_dto: googleAuthDTO
    ) {
        return await this._authService.createUserWithGoogle(google_auth_dto.access_token, google_auth_dto.role)
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

