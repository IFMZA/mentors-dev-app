/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensSchema } from '../models/auth/tokens.model';
import { RegistrationVerificationSchema } from '../models/auth/registerationVerification.model';

import { REGISTERATION_VERIFICATION_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';

import { UsersSchema } from '../models/users.model';

import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';



@Module({
    imports: [MongooseModule.forFeature([
        { name: TOKEN_MODEL_NAME, schema: TokensSchema },
        { name: REGISTERATION_VERIFICATION_MODEL_NAME, schema: RegistrationVerificationSchema },
        { name: USER_MODEL_NAME, schema: UsersSchema },
    ]), UsersModule],
    controllers: [AuthController],
    providers: [AuthService, UsersService],
})
export class AuthModule { }
