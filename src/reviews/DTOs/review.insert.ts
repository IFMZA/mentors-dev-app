/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

class reviewInsertDTO {
    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    mentorId: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    developerId: string;

    @ApiProperty()
    @IsOptional()
    sessionId: string;

    @ApiProperty()
    @IsOptional()
    comment: string;

    @ApiProperty()
    @IsOptional()
    starsCount: number;
}

export default reviewInsertDTO;