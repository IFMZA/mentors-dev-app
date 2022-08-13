/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';


class forgot_password_insert_dto {
    @ApiProperty()
    @IsEmail()
    @IsDefined()
    email: string;
}

export default forgot_password_insert_dto;