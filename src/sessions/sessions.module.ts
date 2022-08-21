/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsSchema } from '../models/sessions.model';
import { TokensSchema } from '../models/auth/tokens.model';
import { MentorPackagesSchema } from '../models/mentorPackages.model';


import { MENTOR_PACKAGE_MODEL_NAME, SESSION_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: SESSION_MODEL_NAME, schema: SessionsSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema },
        { name: MENTOR_PACKAGE_MODEL_NAME, schema: MentorPackagesSchema }
    ])],
    controllers: [SessionsController],
    providers: [SessionsService],
})
export class SessionsModule { }
