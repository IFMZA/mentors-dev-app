/* eslint-disable prettier/prettier */
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

class slotInsertDTO {


    @ApiProperty({ example: "2022-08-25" })
    @IsDefined()
    availableDate: string;

    @ApiProperty({ example: "09:00" })
    @IsDefined()
    @IsString()
    fromTime: string;

    @ApiProperty({ example: "09:30" })
    @IsDefined()
    @IsString()
    ToTime: string;
}

export default slotInsertDTO;