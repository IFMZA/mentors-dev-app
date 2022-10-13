/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { languages, MentorOrderByProperties, OrderByOrdering, skills } from 'src/common/constants';


class mentor_filter_dto {

    @ApiProperty({ required: false })
    @IsOptional()
    searchKeyword: string;


    @ApiProperty({ required: false, enum: Object.values(skills), isArray: true })
    @IsOptional()
    skill: skills[];

    @ApiProperty({ required: false })
    @IsOptional()
    onlineStatus: string;

    @ApiProperty({ required: false })
    @IsOptional()
    country: Array<string>;

    @ApiProperty({ required: false, enum: Object.values(languages), isArray: true})
    @IsOptional()
    language: Array<languages>;

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