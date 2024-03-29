/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { AppRoles } from 'src/common/constants';

class githubAuthDTO {
    @ApiProperty()
    @IsDefined()
    @IsString()
    access_token: string;

    @ApiProperty({ enum: [AppRoles.DEVELOPER, AppRoles.MENTOR] })
    @IsOptional()
    role: string;

}

export default githubAuthDTO;