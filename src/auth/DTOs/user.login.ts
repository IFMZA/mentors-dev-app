/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMobilePhone, IsString } from 'class-validator';

class userLoginDTO {

    @ApiProperty()
    @IsDefined()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    password: string;

}

export default userLoginDTO;