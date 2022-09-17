/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import NotificationInsertDTO from './DTOs/notification.insert';
// import packageUpdateDTO from './DTOs/package.update';



@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('Notifications')

export class NotificationsController {
    constructor(private readonly _noitificationsService: NotificationsService) { }

    @Post('/create')
    async createNotif(
        @Req() request: Request,
        @Body() notif_insert_dto: NotificationInsertDTO,
    ) {
        return await this._noitificationsService.createNotification(request.headers.authorization.replace('Bearer ', ''), notif_insert_dto);
    }

    @Post('/markAsRead/:notificationId')
    async updateNotification(
        @Param('notificationId') notificationId: string
    ) {
        return await this._noitificationsService.markNotificationAsRead(notificationId);
    }

    @Post('/markAllAsRead')
    async updateAllNotification(
        @Req() request: Request,
    ) {
        return await this._noitificationsService.markAllNotificationsAsRead(request.headers.authorization.replace('Bearer ', ''));
    }

    @Get('/getAllNotifications')
    async getNotifications(
        @Req() request: Request,
    ) {
        return await this._noitificationsService.findNotifications(request.headers.authorization.replace('Bearer ', ''), false);
    }

    @Get('/getNewNotifications')
    async getNewNotifications(
        @Req() request: Request,
    ) {
        return await this._noitificationsService.findNotifications(request.headers.authorization.replace('Bearer ', ''), true);
    }

    @Get('/getNewNotificationsCount')
    async getNewNotificationsCount(
        @Req() request: Request,
    ) {
        return await this._noitificationsService.getNewNoficationsCount(request.headers.authorization.replace('Bearer ', ''));
    }

}

