/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';
import { sessionStatus } from 'src/common/constants';

class sessionUpdateDTO {
    @ApiProperty()
    @IsDefined()
    bookedDate: string;

    @ApiProperty()
    @IsDefined()
    startTime: string;

    @ApiProperty()
    @IsDefined()
    timeZone: string;


    @ApiProperty({ enum: Object.values(sessionStatus) })
    @IsOptional()
    status: string;
}

export default sessionUpdateDTO;