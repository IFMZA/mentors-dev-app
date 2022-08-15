/* eslint-disable prettier/prettier */
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class slotUpdateDTO {
    @ApiProperty()
    @IsOptional()
    @IsDate()
    availableDate: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    fromTime: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    ToTime: number;
}

export default slotUpdateDTO;