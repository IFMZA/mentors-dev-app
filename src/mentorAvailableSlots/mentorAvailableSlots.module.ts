/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MentorAvailableSlotsController } from './mentorAvailableSlots.controller';
import { MentorAvailableSlotsService } from './mentorAvailableSlots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MentorAvailableSlotsSchema } from '../models/mentorAvailableSlots.model';
import { TokensSchema } from '../models/auth/tokens.model';


import { MENTOR_AVAILABLE_SLOT_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: MENTOR_AVAILABLE_SLOT_MODEL_NAME, schema: MentorAvailableSlotsSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema }
    ])],
    controllers: [MentorAvailableSlotsController],
    providers: [MentorAvailableSlotsService],
})
export class MentorAvailableSlotsModule { }
