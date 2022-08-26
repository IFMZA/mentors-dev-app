/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMobilePhone, IsString } from 'class-validator';
import { currencies, PackageTypes } from 'src/common/constants';

class packageUpdateDTO {
    @ApiProperty({ enum: [PackageTypes.MINUTES_15, PackageTypes.MINUTES_30, PackageTypes.HOURS_1] })
    @IsOptional()
    packageType: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    price: number;

    @ApiProperty({ enum: Object.values(currencies) })
    @IsOptional()
    @IsString()
    currency: string;

    @ApiProperty({ type: [String] })
    @IsOptional()
    features: string[];
}

export default packageUpdateDTO;