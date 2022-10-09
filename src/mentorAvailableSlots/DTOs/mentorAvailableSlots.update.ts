/* eslint-disable prettier/prettier */
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class slotUpdateDTO {
    @ApiProperty({ example: "2022-08-25" })
    @IsOptional()
    availableDate: string;

    @ApiProperty({ required: false, example: "09:00" })
    @IsOptional()
    @IsString()
    fromTime: string;

    @ApiProperty({ required: false, example: "09:00" })
    @IsOptional()
    @IsString()
    ToTime: string;
}

export default slotUpdateDTO;