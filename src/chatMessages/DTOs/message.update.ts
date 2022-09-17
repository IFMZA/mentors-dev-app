/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

class messageUpdateDTO {
    @ApiProperty()
    @IsDefined()
    @IsString()
    messageBody: string;
}

export default messageUpdateDTO;