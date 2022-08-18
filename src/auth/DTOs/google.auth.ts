/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { AppRoles } from 'src/common/constants';

class googleAuthDTO {
    @ApiProperty()
    @IsDefined()
    @IsString()
    access_token: string;

    @ApiProperty({ enum: [AppRoles.DEVELOPER, AppRoles.MENTOR] })
    @IsDefined()
    @IsString()
    role: string;

}

export default googleAuthDTO;