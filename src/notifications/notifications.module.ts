/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsSchema } from '../models/notifications.model';
import { UsersSchema } from '../models/users.model';

import { TokensSchema } from '../models/auth/tokens.model';


import { NOTIFICATION_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';



@Module({
    imports: [MongooseModule.forFeature([
        { name: NOTIFICATION_MODEL_NAME, schema: NotificationsSchema },
        { name: USER_MODEL_NAME, schema: UsersSchema },
        { name: TOKEN_MODEL_NAME, schema: TokensSchema }
    ])],
    controllers: [NotificationsController],
    providers: [NotificationsService],
})
export class NotificationsModule { }
