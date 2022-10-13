/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Min } from 'class-validator';

class paymentInsertDTO {

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    sessionId: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    @Min(1)
    amount: number;

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    currency: string;
}

export default paymentInsertDTO;