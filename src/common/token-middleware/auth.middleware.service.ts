/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IToken } from 'src/models/auth/tokens.model';
import { TOKEN_MODEL_NAME } from '../constants';

@Injectable()
export class AuthMiddlewareService {
  constructor(
    @InjectModel(TOKEN_MODEL_NAME) private authModel: Model<IToken>,
  ) {}

  async checkToken(request) {
    if (request.headers.authorization) {
      const jwt = request.headers.authorization.replace('Bearer ', '');
      const token_result = await this.authModel.find({
        token: jwt,
      });
      if (token_result) {
        if (token_result.length > 0) {
          return true;
        }
      }
    } else {
      console.log('authorization-header-missing');
    }

    return false;
  }
}
