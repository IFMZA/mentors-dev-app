/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

class sessionUpdateDTO {
    @ApiProperty()
    @IsDefined()
    bookedDate: string;

    @ApiProperty()
    @IsDefined()
    startTime: string;

    @ApiProperty()
    @IsDefined()
    endTime: string;
}

export default sessionUpdateDTO;