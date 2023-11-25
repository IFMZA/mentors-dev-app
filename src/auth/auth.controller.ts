/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import userRegisterDTO from './DTOs/user.register';
import userLoginDTO from './DTOs/user.login';
import googleAuthDTO from './DTOs/google.auth';
import githubAuthDTO from './DTOs/github.auth';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @ApiBody({ type: userRegisterDTO })
  @Post('sign-up')
  async register(@Body() user_register_dto: userRegisterDTO) {
    return await this._authService.register(user_register_dto);
  }

  @ApiBody({ type: userLoginDTO })
  @Post('/sign-in')
  async loginBasic(@Body() user_login_dto: userLoginDTO) {
    return await this._authService.login(user_login_dto);
  }

  @ApiBody({ type: googleAuthDTO })
  @Post('/google')
  async loginWithGoogle(
    @Req() request: Request,
    @Body() google_auth_dto: googleAuthDTO,
  ) {
    const base_url = `${request.protocol}://${request.get('Host')}/`;
    return await this._authService.createUserWithGoogle(
      base_url,
      google_auth_dto.access_token,
      google_auth_dto.role,
    );
  }

  @ApiBody({ type: githubAuthDTO })
  @Post('/github')
  async loginWithGitHub(
    @Req() request: Request,
    @Body() github_auth_dto: githubAuthDTO,
  ) {
    const base_url = `${request.protocol}://${request.get('Host')}/`;
    return await this._authService.createUserWithGithub(
      base_url,
      github_auth_dto.access_token,
      github_auth_dto.role,
    );
  }
}
