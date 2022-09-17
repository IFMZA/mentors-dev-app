/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

class messageInsertDTO {
    @ApiProperty()
    @IsDefined()
    @IsString()
    messageBody: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    from_id: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    to_id: string;
}

export default messageInsertDTO;