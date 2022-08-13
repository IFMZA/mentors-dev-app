/* eslint-disable prettier/prettier */
import * as jwt from 'jsonwebtoken';

export function get_token(userId) {
    try {
        const secret = "tyy@v$6rpowb&PLWWEHCOHQ$AUDRbds";
        const token = jwt.sign({ userId: userId, now: Date.now().toString() }, secret);
        return token;
    } catch (error) {
        console.error(error);
    }
}