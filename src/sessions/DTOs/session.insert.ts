/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

class sessionInsertDTO {
    @ApiProperty()
    @IsDefined()
    mentorId: string;

    @ApiProperty()
    @IsDefined()
    packageId: string;

    @ApiProperty()
    @IsDefined()
    bookedDate: string;

    @ApiProperty()
    @IsDefined()
    startTime: string;

    @ApiProperty()
    @IsDefined()
    timeZone: string;
}

export default sessionInsertDTO;