/* eslint-disable prettier/prettier */
import { IsDate, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OpTypes } from './saveMany.operation.types';

class slotSaveManyDTO {

    @ApiProperty({ required: false })
    @IsOptional()
    slotId: string;

    @ApiProperty({ required: false, example: "2022-08-25" })
    @IsOptional()
    availableDate: string;

    @ApiProperty({ required: false, example: "09:00" })
    @IsOptional()
    @IsString()
    fromTime: string;

    @ApiProperty({ required: false , example: "09:30"})
    @IsOptional()
    @IsString()
    ToTime: string;

    @ApiProperty({ required: true, enum: [OpTypes.NEW, OpTypes.MODIFIED, OpTypes.DELETED] })
    @IsDefined()
    opType: string;

}

export default slotSaveManyDTO;