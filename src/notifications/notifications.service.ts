/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { notificationTemplates, NOTIFICATION_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';

import { INotification } from '../models/notifications.model';
import { IUser } from '../models/users.model';

import { IToken } from '../models/auth/tokens.model';
// import packageInsertDTO from './DTOs/package.insert';
import { generateUUID } from 'src/common/utils/generalUtils';
import NotificationInsertDTO from './DTOs/notification.insert';
// import packageUpdateDTO from './DTOs/package.update';





@Injectable()
export class NotificationsService {
    constructor(@InjectModel(NOTIFICATION_MODEL_NAME) private _notifModel: Model<INotification>,
        @InjectModel(USER_MODEL_NAME) private _userModel: Model<IUser>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>) { }

    async createNotification(token: string, notif_insert_dto: NotificationInsertDTO) {
        console.log('create notif');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        const found_templates = notificationTemplates.filter(x => x.type == notif_insert_dto.notificationType);
        if (found_templates.length == 0)
            throw new ConflictException({ message: "wrong notification type" });

        const notif_template = found_templates[0];
        notif_template.body.replace("{name}", notif_insert_dto.name);

        const notid_insert = new this._notifModel({
            notificationId: generateUUID(),
            notificationType: notif_insert_dto.notificationType,
            from_id: notif_insert_dto.fromId,
            to_id: notif_insert_dto.toId,
            title: notif_template.title,
            body: notif_template.body,
            createdAt: Date.now()
        });
        const result = await notid_insert.save();
        return result;
    }



    // async update(packageId: string, package_update_dto: packageUpdateDTO) {
    //     console.log('update package');
    //     return await this._packageModel.findOneAndUpdate({
    //         packageId: packageId
    //     }, package_update_dto, { upsert: false, new: true });
    // }

    // async delete(packageId: string) {
    //     console.log('delete package');
    //     return await this._packageModel.findOneAndDelete({ packageId: packageId });
    // }

    async findNotifications(token: string, IsNew: boolean) {
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;
        if (IsNew) {
            return await this._notifModel.find({ readStatus: false, to_id: userId });
        }
        else {
            return await this._notifModel.find({ to_id: userId });
        }
    }

    async getNewNoficationsCount(token: string) {
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;
        return (await this._notifModel.find({ readStatus: true, to_id: userId })).length;
    }


    async markNotificationAsRead(NotificationId: string) {
        return await this._notifModel.findOneAndUpdate({
            notificationId: NotificationId
        }, { readStatus: true }, { upsert: false, new: true });
    }

    async markAllNotificationsAsRead(token: string) {
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;
        return await this._notifModel.updateMany({ to_id: userId }, { readStatus: true });
    }
}
