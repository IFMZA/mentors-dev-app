/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class replyUpdateDTO {
    @ApiProperty()
    @IsOptional()
    replyText: string;
}

export default replyUpdateDTO;