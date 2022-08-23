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
    fromTime: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    ToTime: string;
}

export default slotUpdateDTO;