/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class reviewUpdateDTO {

    @ApiProperty()
    @IsOptional()
    comment: string;

    @ApiProperty()
    @IsOptional()
    starsCount: number;
}

export default reviewUpdateDTO;