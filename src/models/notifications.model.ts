/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { notificationType } from 'src/common/constants';

export const NotificationsSchema = new mongoose.Schema({
    notificationId: { type: String, unique: true, required: false },
    title: { type: String, required: false },
    body: { type: String, required: false },
    from_id: { type: String, required: false },
    to_id: { type: String, required: false },
    readStatus: { type: Boolean, default: false, required: false },
    notificationType: { type: String, enum: Object.values(notificationType), required: false },
    createdAt: { type: Date, default: Date.now, required: false },
    updatedAt: { type: Date, default: Date.now, required: false }
}, { collection: "Notifications" });

export interface INotification {
    notificationId: string;
    title: string;
    body: string;
    from_id: string;
    to_id: string;
    readStatus: boolean;
    notificationType: string;
    createdAt: Date;
    updatedAt: Date;
};