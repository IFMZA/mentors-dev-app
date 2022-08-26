/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { AppRoles } from 'src/common/constants';

class replyInsertDTO {

    @ApiProperty()
    @IsDefined()
    commentId: string;

    @ApiProperty()
    @IsDefined()
    userId: string;

    @ApiProperty({ enum: Object.values(AppRoles) })
    @IsDefined()
    role: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    replyText: string;
}

export default replyInsertDTO;