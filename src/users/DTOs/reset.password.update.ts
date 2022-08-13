/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

class reset_password_update_dto {

    @ApiProperty()
    @IsDefined()
    oldPassword: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    newPassword: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    email: string;
}

export default reset_password_update_dto;