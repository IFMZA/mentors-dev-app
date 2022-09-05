/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { AppRoles } from 'src/common/constants';

class commentInsertDTO {

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ enum: Object.values(AppRoles) })
    @IsDefined()
    role: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    commentText: string;
}

export default commentInsertDTO;