/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';


class verify_password_update_dto {

    @ApiProperty()
    @IsDefined()
    email: string;

    @ApiProperty()
    @IsDefined()
    verificationCode: string
}

export default verify_password_update_dto;