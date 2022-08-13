/* eslint-disable prettier/prettier */
import { IsDefined } from 'class-validator';

class user_google_insert_dto {
    @IsDefined()
    googleId: string;
    firstName: string;
    lastName: string;
    @IsDefined()
    email: string;
    @IsDefined()
    role: string;
    profileImg: {
        original: string,
        thumbnail: string
    };
}

export default user_google_insert_dto;