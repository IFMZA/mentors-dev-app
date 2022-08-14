/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { currencies, PackageTypes } from 'src/common/constants';

export const MentorPackagesSchema = new mongoose.Schema({
    packageId: { type: String, unique: true, required: false },
    mentorId: { type: String, required: false },
    packageType: { type: String, enum: [PackageTypes.MINUTES_15, PackageTypes.MINUTES_30, PackageTypes.HOURS_1], required: false },
    price: { type: Number, default: 0, required: false },
    currency: { type: String, enum: [currencies.EGP, currencies.USD], required: false },
    features: { type: [String], required: false },
    updatedAt: { type: Date, required: false }
}, { collection: "MentorPackages" });

export interface IMentorPackage {
    packageId: string;
    mentorId: string;
    packageType: string;
    price: number;
    currency: string;
    features: string[];
    updatedAt: Date;
};

MentorPackagesSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        // ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});