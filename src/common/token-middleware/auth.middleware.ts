/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthMiddlewareService } from './auth.middleware.service';

const exculded_routes = [
  '/auth/sign-up',
  '/auth/sign-in',
  '/auth/google',
  '/auth/github',
  '/forgot-password',
  '/verify',
  '/getMentors',
  '/getMentorById',
  '/getReplies',
  'getPackages',
  'getAvailableSlots',
  'getReviews',
  'getComments',
  'files',
  'favicon.ico',
];

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(public authService: AuthMiddlewareService) {}

  async checkToken(req) {
    let excluded = false;
    for (const idx in exculded_routes) {
      if (
        exculded_routes[idx].includes(req.baseUrl) ||
        req.baseUrl.includes(exculded_routes[idx])
      ) {
        excluded = true;
        break;
      } else {
        console.log(exculded_routes[idx] + ' -- ' + req.baseUrl);
      }
    }

    if (excluded) {
      console.log('excluded-route');
      return true;
    } else {
      const token_valid = await this.authService.checkToken(req);
      if (token_valid) {
        console.log('Valid-Token');
      } else {
        console.log('In-Valid-Token');
      }
      return token_valid;
    }
  }
  async use(req: any, res: any, next: () => void) {
    const token_valid = await this.checkToken(req);
    if (token_valid) {
      next();
    } else {
      throw new UnauthorizedException({ message: 'Authentication Failed' });
    }
  }
}
