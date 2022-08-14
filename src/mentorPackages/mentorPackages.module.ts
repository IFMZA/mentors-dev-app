/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MentorPackagesController } from './mentorPackages.controller';
import { MentorPackagesService } from './mentorPackages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MentorPackagesSchema } from '../models/mentorPackages.model';
import { TokensSchema } from '../models/auth/tokens.model';


import { MENTOR_PACKAGE_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: MENTOR_PACKAGE_MODEL_NAME, schema: MentorPackagesSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema }
    ])],
    controllers: [MentorPackagesController],
    providers: [MentorPackagesService],
})
export class MentorPackagesModule { }
