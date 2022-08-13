/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { AppRoles } from '../constants';

export const Roles = (...roles: AppRoles[]) => SetMetadata('roles', roles);