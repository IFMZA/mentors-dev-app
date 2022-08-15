/* eslint-disable prettier/prettier */
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

class slotInsertDTO {


    @ApiProperty()
    @IsDefined()
    @IsDate()
    availableDate: Date;

    @ApiProperty()
    @IsDefined()
    @IsString()
    fromTime: number;

    @ApiProperty()
    @IsDefined()
    @IsString()
    ToTime: number;
}

export default slotInsertDTO;