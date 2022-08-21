/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMobilePhone, IsString } from 'class-validator';
import { currencies } from 'src/common/constants';

class userUpdateDTO {
    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    title: string;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsMobilePhone()
    @IsOptional()
    phone: string;

    @ApiProperty()
    @IsOptional()
    @IsOptional()
    location: string;

    @ApiProperty()
    @IsOptional()
    website: string;

    @ApiProperty({ enum: [currencies.EGP, currencies.USD] })
    @IsOptional()
    preferredCurrency: string;

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
}

export default userUpdateDTO;