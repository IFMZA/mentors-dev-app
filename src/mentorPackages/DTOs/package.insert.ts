/* eslint-disable prettier/prettier */

import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { currencies, PackageTypes } from 'src/common/constants';

class packageInsertDTO {
    @ApiProperty({ enum: [PackageTypes.MINUTES_15, PackageTypes.MINUTES_30, PackageTypes.HOURS_1] })
    @IsDefined()
    packageType: string;

    @ApiProperty()
    @IsDefined()
    @IsNumber()
    price: number;

    @ApiProperty({ enum: [currencies.EGP, currencies.USD] })
    @IsDefined()
    @IsString()
    currency: string;

    @ApiProperty({ type: [String] })
    @IsDefined()
    features: string[];
}

export default packageInsertDTO;