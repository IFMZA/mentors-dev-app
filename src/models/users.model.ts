/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { AppRoles, AuthMethods, currencies } from 'src/common/constants';

export const UsersSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: false },
    name: { type: String, unique: false, required: false },
    title: { type: String, unique: false, required: false },
    email: { type: String, unique: true, lowercase: true, trim: true, required: false },
    phone: { type: String, index: true, unique: true, lowercase: true, trim: true, sparse: true, required: false },
    password: { type: String, required: false },
    profileImage: { type: String, required: false },
    location: { type: String, required: false },
    website: { type: String, required: false },
    preferredCurreny: { type: String, enum: Object.values(currencies), required: false },
    languages: { type: [String], required: false },
    skills: { type: [String], required: false },
    bio: { type: String, required: false },
    experience: { type: String, required: false },
    currentCompany: { type: String, required: false },
    education: { type: String, required: false },
    onlineStatus: { type: Boolean, default: true, required: false },
    doneClientsCount: { type: Number, default: 0, required: false },
    rate: { type: Number, default: 0, required: false },
    wallletBalance: { type: Number, default: 0, required: false },
    role: { type: String, enum: Object.values(AppRoles), required: false },
    authMethod: { type: String, enum: [AuthMethods.GOOGLE, AuthMethods.GITHUB, AuthMethods.LOCAL], required: false },
    authCredentials: { type: [Object], required: false },
    isVerified: { type: Boolean, required: false },
    createdAt: { type: Date, default: Date.now(), required: false }
}, { collection: "Users" });

export interface IUser {
    userId: string;
    name: string;
    title: string;
    email: string;
    phone: string;
    password: string;
    profileImage: string;
    location: string;
    website: string;
    preferredCurreny: string;
    languages: string[];
    skills: string[];
    bio: string;
    experience: string;
    currentCompany: string;
    education: string;
    onlineStatus: boolean;
    doneClientsCount: number;
    rate: number;
    wallletBalance: number;
    role: string;
    authMethod: string;
    authCredentials: object[];
    isVerified: boolean;
    createdAt: Date;
};

UsersSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        // ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});