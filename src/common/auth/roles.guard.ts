/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AppRoles } from "../constants";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private refletor: Reflector) { }
    canActivate(context: ExecutionContext): boolean {

        //Extract Role above controller end point to check it
        const requireRoles = this.refletor.getAllAndOverride<AppRoles[]>('roles', [
            context.getHandler(),
            context.getClass()
        ]);



        //check user auth
        const _request = context.switchToHttp().getRequest();
        console.log(_request.headers)



        return true;
    }
}