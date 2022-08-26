/* eslint-disable prettier/prettier */

import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone } from 'class-validator';
import { currencies, languages, skills } from 'src/common/constants';

class userUpdateDTO {
    @ApiProperty({ required: false })
    @IsOptional()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    title: string;

    @ApiProperty({ required: false })
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty({ required: false })
    @IsMobilePhone()
    @IsOptional()
    phone: string;

    @ApiProperty({ required: false })
    @IsOptional()
    location: string;

    @ApiProperty({ required: false })
    @IsOptional()
    website: string;

    @ApiProperty({ required: false, enum: Object.values(currencies) })
    @IsOptional()
    preferredCurrency: string;

    @ApiProperty({ required: false, enum: Object.values(languages), isArray: true, example: [languages.Arabic, languages.English, languages.Germany] })
    @IsOptional()
    languages: string[];

    @ApiProperty({ required: false, enum: Object.values(skills), isArray: true, example: [skills.html, skills.css, skills.javascript] })
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

    @ApiProperty({ required: false })
    @IsOptional()
    onlineStatus: boolean;
}

export default userUpdateDTO;