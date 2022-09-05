/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

class sessionInsertDTO {
    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    mentorId: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
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