/* eslint-disable prettier/prettier */
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

class freeSlotGetDTO {

    @ApiProperty()
    @IsDefined()
    @IsString()
    mentor_id: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    package_id: string;

    @ApiProperty({ example: 'Afica/Cairo' })
    @IsDefined()
    @IsString()
    time_zone: string;
}

export default freeSlotGetDTO;