/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { notificationType } from 'src/common/constants';

class NotificationInsertDTO {

    @ApiProperty()
    @IsDefined()
    fromId: string;
    @ApiProperty()
    @IsDefined()
    toId: string;

    @ApiProperty()
    @IsDefined()
    name: string;

    @ApiProperty({ enum: Object.values(notificationType) })
    @IsDefined()
    @IsString()
    notificationType: string;
}

export default NotificationInsertDTO;