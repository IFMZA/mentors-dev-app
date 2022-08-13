/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgotPasswordSchema } from '../models/auth/forgotPassword.model';

import { FORGOT_PASSWORD_MODEL_NAME, REGISTERATION_VERIFICATION_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';

import { UsersSchema } from '../models/users.model';

import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TokensSchema } from 'src/models/auth/tokens.model';
import { RegistrationVerificationSchema } from 'src/models/auth/registerationVerification.model';



@Module({
    imports: [MongooseModule.forFeature([
        { name: TOKEN_MODEL_NAME, schema: TokensSchema },
        { name: FORGOT_PASSWORD_MODEL_NAME, schema: ForgotPasswordSchema },
        { name: REGISTERATION_VERIFICATION_MODEL_NAME, schema: RegistrationVerificationSchema },
        { name: USER_MODEL_NAME, schema: UsersSchema },
    ]), UsersModule],
    controllers: [ForgotPasswordController],
    providers: [ForgotPasswordService, UsersService],
})
export class ForgotPasswordModule { }
