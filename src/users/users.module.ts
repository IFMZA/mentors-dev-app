/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from '../models/users.model';
import { TokensSchema } from '../models/auth/tokens.model';

import { RegistrationVerificationSchema } from '../models/auth/registerationVerification.model';

import { USER_MODEL_NAME, REGISTERATION_VERIFICATION_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: USER_MODEL_NAME, schema: UsersSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema },
        { name: REGISTERATION_VERIFICATION_MODEL_NAME, schema: RegistrationVerificationSchema }
    ])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }
