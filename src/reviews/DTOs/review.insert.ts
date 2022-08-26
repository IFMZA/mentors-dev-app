/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

class reviewInsertDTO {
    @ApiProperty()
    @IsDefined()
    mentorId: string;

    @ApiProperty()
    @IsDefined()
    developerId: string;

    @ApiProperty()
    @IsOptional()
    comment: string;

    @ApiProperty()
    @IsOptional()
    starsCount: number;
}

export default reviewInsertDTO;