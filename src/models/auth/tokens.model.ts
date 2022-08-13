/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const TokensSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    token: { type: String, unique: true, required: false }
}, { collection: "Tokens" });

export interface IToken {
    userId: string;
    token: string;
};