/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { AuthMiddlewareService } from "./auth.middleware.service";

const exculded_routes = [
    '/doctors/login',
    '/doctors/register',
    '/operators/login',
    '/places/insertPlaceWithOperator',
    '/patients/login',
    '/patients/insert',
    '/configs/getPlayStoreVersions'
];

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
    constructor(public authService: AuthMiddlewareService) { }

    async checkToken(req) {
        console.log(req.baseUrl);
        if (exculded_routes.includes(req.baseUrl)) {
            console.log('excluded-route');
            return true;
        }
        else {
            const token_valid = await this.authService.checkToken(req);
            if (token_valid) {
                console.log('Valid-Token');
            }
            else {
                console.log('Not-Valid-Token');
            }
            return token_valid;
        }

    }
    async use(req: any, res: any, next: () => void) {
        const token_valid = await this.checkToken(req);
        if (token_valid) {
            next();
        }
        else {
            // res.writeHead(401, { 'content-type': 'application/json' })
            throw new UnauthorizedException({ message: 'Authentication Failed' });
            // res.write(JSON.stringify({ success: false, message: 'Authentication Failed' }));
            // res.end();
        }
    }
}