/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { languages, MentorOrderByProperties, OrderByOrdering, skills } from 'src/common/constants';


class mentor_filter_dto {

    @ApiProperty({ required: false })
    @IsOptional()
    company: string;

    @ApiProperty({ required: false })
    @IsOptional()
    name: string;

    @ApiProperty({ required: false, enum: Object.values(skills) })
    @IsOptional()
    skill: string;

    @ApiProperty({ required: false })
    @IsOptional()
    onlineStatus: string;

    @ApiProperty({ required: false })
    @IsOptional()
    country: string;

    @ApiProperty({ required: false, enum: Object.values(languages) })
    @IsOptional()
    language: string;

    @ApiProperty({ required: true })
    @IsDefined()
    @IsNumber()
    pageId: number;

    @ApiProperty({ enum: Object.values(MentorOrderByProperties), required: false, })
    @IsOptional()
    sortBy: string;

    @ApiProperty({ enum: Object.values(OrderByOrdering), required: false, })
    @IsOptional()
    sortOrder: string;
}

export default mentor_filter_dto;