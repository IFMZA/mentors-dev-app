/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { AppRoles } from 'src/common/constants';

class googleAuthDTO {
    @ApiProperty()
    @IsDefined()
    @IsString()
    access_token: string;

    @ApiProperty()
    @IsOptional()
    role: string;

}

export default googleAuthDTO;