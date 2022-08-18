/* eslint-disable prettier/prettier */
import { IsDate, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OpTypes } from './saveMany.operation.types';

class slotSaveManyDTO {

    @ApiProperty({ required: false })
    @IsOptional()
    slotId: string;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsDate()
    availableDate: Date;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsString()
    fromTime: number;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsString()
    ToTime: number;

    @ApiProperty({ required: true, enum: [OpTypes.NEW, OpTypes.MODIFIED, OpTypes.DELETED] })
    @IsDefined()
    opType: string;

}

export default slotSaveManyDTO;