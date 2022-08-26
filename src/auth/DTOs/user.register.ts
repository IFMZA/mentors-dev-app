/* eslint-disable prettier/prettier */

import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMobilePhone, IsString } from 'class-validator';
import { AppRoles, currencies, languages, skills } from 'src/common/constants';

class userRegisterDTO {
    @ApiProperty({ required: false })
    @IsOptional()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    title: string;

    @ApiProperty()
    @IsDefined()
    @IsEmail()
    email: string;

    @ApiProperty({ required: false })
    @IsMobilePhone()
    @IsOptional()
    phone: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    password: string;

    @ApiProperty({ required: false })
    @IsOptional()
    website: string;

    @ApiProperty({ required: false, enum: Object.values(currencies) })
    @IsOptional()
    preferredCurreny: string;

    @ApiProperty({ required: false })
    @IsOptional()
    location: string;

    @ApiProperty({ required: false, enum: Object.values(languages) })
    @IsOptional()
    languages: string[];

    @ApiProperty({ required: false, enum: Object.values(skills) })
    @IsOptional()
    skills: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    bio: string;

    @ApiProperty({ required: false })
    @IsOptional()
    experience: string;

    @ApiProperty({ required: false })
    @IsOptional()
    currentCompany: string;

    @ApiProperty({ required: false })
    @IsOptional()
    education: string;

    @ApiProperty({ enum: Object.values(AppRoles) })
    @IsOptional()
    role: string;
}

export default userRegisterDTO;