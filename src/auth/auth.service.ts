/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppRoles, REGISTERATION_VERIFICATION_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';

import { IToken } from 'src/models/auth/tokens.model';
import { IRegistrationVerification } from 'src/models/auth/registerationVerification.model';
import userRegisterDTO from './DTOs/user.register';
import { UsersService } from 'src/users/users.service';
import user_google_insert_dto from 'src/users/DTOs/user.google.insert';
import axios from 'axios';
import user_github_insert_dto from 'src/users/DTOs/user.github.insert';
import userLoginDTO from './DTOs/user.login';




@Injectable()
export class AuthService {
    constructor(@InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>,
        @InjectModel(REGISTERATION_VERIFICATION_MODEL_NAME) private _regVerify: Model<IRegistrationVerification>,
        private readonly _userServise: UsersService) { }


    async register(user_register_dto: userRegisterDTO) {
        console.log('user_register_dto');
        console.log(user_register_dto);
        const user = await this._userServise.createUserBasic(user_register_dto);
        return user;
    }


    // Login With Google
    async createUserWithGoogle(base_url: string, access_token: string, role: string) {
        if (role) {
            if (!AppRoles.DEVELOPER.includes(role) && !AppRoles.MENTOR.includes(role)) {
                throw new BadRequestException({ message: "role not found" })
            }
        }

        const googleUserRes = await this.getGoogleUserData(access_token);
        const googleUser = new user_google_insert_dto;
        googleUser.googleId = googleUserRes.id;
        googleUser.firstName = googleUserRes.given_name;
        googleUser.lastName = googleUserRes.family_name;
        googleUser.email = googleUserRes.email;
        googleUser.profileImg = {
            original: googleUserRes.picture.split("=s")[0] + '=s500-c',
            thumbnail: googleUserRes.picture
        };
        const user = await this._userServise.createUserWithGoogle(base_url, googleUser, role)
        return user;
    }


    private async getGoogleUserData(access_token: string) {
        console.log('google-Auth');
        console.log(access_token);
        let data;
        const params = {
            alt: 'json',
            access_token
        }
        try {
            const res = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
                params,
            })
            if (res.data) {
                data = res.data
                console.log(res.data)
            }
        } catch (error) {
            console.log(error);
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);

                throw new BadRequestException({ message: error.response.data })

            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        }
        return data;
    };



    async createUserWithGithub(base_url: string, access_token: string, role: string) {
        console.log('createUserWithGithub');
        if (role) {
            if (!AppRoles.DEVELOPER.includes(role) && !AppRoles.MENTOR.includes(role)) {
                throw new BadRequestException({ message: "role not found" })
            }
        }

        const githubUserRes = await this.getGitHubUserData(access_token);

        if (githubUserRes.name == "" || githubUserRes.name == null) {
            throw new BadRequestException({ message: "name not found" })
        }
        // if(githubUserRes.email == "" || githubUserRes.email == null){
        //     throw new BadRequestException({ message: "email not found" })
        // }


        const gitHubUser = new user_github_insert_dto;
        gitHubUser.name = githubUserRes.name;
        gitHubUser.email = githubUserRes.email;
        gitHubUser.id = githubUserRes.id;
        gitHubUser.type = githubUserRes.type;
        gitHubUser.avatar_url = githubUserRes.avatar_url;
        gitHubUser.bio = githubUserRes.bio;
        gitHubUser.followers = githubUserRes.followers;
        gitHubUser.following = githubUserRes.following;
        gitHubUser.location = githubUserRes.location;
        gitHubUser.node_id = githubUserRes.node_id;
        gitHubUser.role = role;
        console.log('gotoUserService');
        const user = await this._userServise.createUserWithGithub(base_url, gitHubUser, role)
        return user;
    }


    private async getGitHubUserData(access_token: string) {
        let data = null;
        try {
            // const res2 = await axios.get(`https://api.github.com/users/${'user_name'}`);
            const res = await axios.get(`https://api.github.com/user`, {
                headers: {
                    'Authorization': `token ${access_token}`
                }
            });
            if (res.data) {
                if (res.data.message == "Not Found") {
                    data = null;
                }
                else {
                    data = res.data
                }
            }
        } catch (error) {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);

                throw new BadRequestException({ message: error.response.data })

            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        }
        return data;
    };


    async login(user_login_dto: userLoginDTO) {
        console.log('user_login_dto');
        console.log(user_login_dto);
        const user = await this._userServise.checkLoginCredintials(user_login_dto.email, user_login_dto.password);
        return user;
    }

}
