/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MentorAvailableSlotsController } from './mentorAvailableSlots.controller';
import { MentorAvailableSlotsService } from './mentorAvailableSlots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MentorAvailableSlotsSchema } from '../models/mentorAvailableSlots.model';
import { SessionsSchema } from '../models/sessions.model';
import { MentorPackagesSchema } from '../models/mentorPackages.model';
import { TokensSchema } from '../models/auth/tokens.model';


import { MENTOR_AVAILABLE_SLOT_MODEL_NAME, MENTOR_PACKAGE_MODEL_NAME, SESSION_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: MENTOR_AVAILABLE_SLOT_MODEL_NAME, schema: MentorAvailableSlotsSchema },
        { name: SESSION_MODEL_NAME, schema: SessionsSchema },
        { name: MENTOR_PACKAGE_MODEL_NAME, schema: MentorPackagesSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema }
    ])],
    controllers: [MentorAvailableSlotsController],
    providers: [MentorAvailableSlotsService],
})
export class MentorAvailableSlotsModule { }
