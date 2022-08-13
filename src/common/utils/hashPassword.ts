/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcryptjs';

export async function getHashed(password: string) {
    const salt = bcrypt.genSaltSync();
    return await bcrypt.hash(password, salt);
}


export const comparePasswords = async (candidatePassword: string, userPassword: string) => {
    const isMatched = await bcrypt.compare(candidatePassword, userPassword);
    if (!isMatched) return null;
    return isMatched;
}