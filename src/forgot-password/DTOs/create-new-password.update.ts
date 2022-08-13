/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';


class create_new_password_update_dto {
    @ApiProperty()
    @IsEmail()
    @IsDefined()
    email: string;

    @ApiProperty()
    @IsDefined()
    password: string;
}

export default create_new_password_update_dto;