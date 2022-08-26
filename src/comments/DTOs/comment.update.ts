/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class commentUpdateDTO {
    @ApiProperty()
    @IsOptional()
    commentText: string;
}

export default commentUpdateDTO;