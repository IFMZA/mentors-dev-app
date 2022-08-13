/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMobilePhone, IsString } from 'class-validator';

class userRegisterDTO {
    @ApiProperty()
    @IsDefined()
    name: string;

    @ApiProperty()
    @IsDefined()
    title: string;

    @ApiProperty()
    @IsDefined()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsMobilePhone()
    phone: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    password: string;

    @ApiProperty()
    @IsOptional()
    location: string;

    @ApiProperty()
    @IsOptional()
    languages: string[];

    @ApiProperty()
    @IsOptional()
    skills: string[];

    @ApiProperty()
    @IsOptional()
    bio: string;

    @ApiProperty()
    @IsOptional()
    experience: string;

    @ApiProperty()
    @IsOptional()
    currentCompany: string;

    @ApiProperty()
    @IsOptional()
    education: string;

    @ApiProperty()
    @IsOptional()
    doneClientsCount: number;

    @ApiProperty()
    @IsOptional()
    role: string;
}

export default userRegisterDTO;