/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IToken } from 'src/models/auth/tokens.model';
import { TOKEN_MODEL_NAME } from '../constants';
// import * as userTypes from '../Dict/userTypes';




@Injectable()
export class AuthMiddlewareService {
    constructor(@InjectModel(TOKEN_MODEL_NAME) private authModel: Model<IToken>) { }


    // async generateToken(userType, username) {
    //     const new_token = this.generateUUid();
    //     let saved = false;
    //     try {
    //         const _newToken = new this.authModel({
    //             userType: userType,
    //             token: new_token,
    //             userName: username,
    //             createdAt: Date.now()
    //         });
    //         const result = await _newToken.save();
    //         console.log(result);
    //         if (result.id) {
    //             saved = true;
    //         }
    //     } catch (error) {
    //         console.log('error');
    //         console.log(error);
    //         saved = false;
    //     }
    //     if (saved) {
    //         const _response = {
    //             success: true,
    //             userType: userType,
    //             username: username,
    //             token: new_token
    //         };
    //         return _response;
    //     }
    //     else {
    //         const _response = {
    //             success: false,
    //             userType: userType,
    //             username: username,
    //             token: null
    //         };
    //         return _response;
    //     }
    // }

    // async deleteToken(request) {
    //     console.log(request.headers)
    //     const jwt = request.headers.authorization.replace('Bearer ', '');
    //     const result = await this.authModel.deleteOne({
    //         token: jwt
    //     });
    //     if (result) {
    //         if (result.deletedCount) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    async checkToken(request) {
        console.log(request.headers.authorization)
        if (request.headers.authorization) {
            const jwt = request.headers.authorization.replace('Bearer ', '');
            const token_result = await this.authModel.find({
                token: jwt
            });
            if (token_result) {
                if (token_result.length > 0) {
                    return true;
                }
            }
        }
        else{
            console.log('authorization-header-missing')
        }

        return false;
    }


    // generateUUid() {
    //     let u = "";
    //     const m = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    //     let i = 0;
    //     let rb = Math.random() * 0xffffffff | 0;

    //     while (i++ < 36) {
    //         const c = m[i - 1];
    //         const r = rb & 0xf;
    //         const v = c == "x" ? r : (r & 0x3 | 0x8);
    //         u += (c == "-" || c == "4") ? c : v.toString(16);
    //         rb = i % 8 == 0 ? Math.random() * 0xffffffff | 0 : rb >> 4;
    //     }
    //     return u;
    // }


}
