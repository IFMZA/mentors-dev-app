/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthMethods, REGISTERATION_VERIFICATION_MODEL_NAME, TOKEN_MODEL_NAME, USER_MODEL_NAME } from 'src/common/constants';

import { IUser } from '../models/users.model';
import { IRegistrationVerification } from 'src/models/auth/registerationVerification.model';
import { IToken } from '../models/auth/tokens.model';

import user_google_insert_dto from './DTOs/user.google.insert';
import userRegisterDTO from 'src/auth/DTOs/user.register';
import { generateRandomNumber, generateUUID } from 'src/common/utils/generalUtils';
import { comparePasswords, getHashed } from '../common/utils/hashPassword'
import { get_token } from 'src/common/auth/tokenGenerator';
import user_github_insert_dto from './DTOs/user.github.insert';
import verify_password_update_dto from 'src/forgot-password/DTOs/verify-password.update';
import userUpdateDTO from './DTOs/user.update';
// import userRegisterDTO from './DTOs/user.register';




@Injectable()
export class UsersService {
    constructor(@InjectModel(USER_MODEL_NAME) private _userModel: Model<IUser>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>,
        @InjectModel(REGISTERATION_VERIFICATION_MODEL_NAME) private _regVerify: Model<IRegistrationVerification>) { }

    async createUserBasic(user_register_dto: userRegisterDTO) {
        console.log('create user basic');
        //insert user in database with verified = false
        const user_insert = new this._userModel({
            userId: generateUUID(),
            name: user_register_dto.name,
            title: user_register_dto.title,
            password: await getHashed(user_register_dto.password),
            location: user_register_dto.location,
            languages: user_register_dto.languages,
            skills: user_register_dto.skills,
            bio: user_register_dto.bio,
            experience: user_register_dto.experience,
            currentCompany: user_register_dto.currentCompany,
            education: user_register_dto.education,
            doneClientsCount: user_register_dto.doneClientsCount,
            role: user_register_dto.role,
            authMethod: AuthMethods.LOCAL,
            isVerified: false
        });
        if (user_register_dto.email != null) { user_insert.email = user_register_dto.email; }
        else { console.log('delete'); delete user_insert.email; }
        if (user_register_dto.phone != null) { user_insert.phone = user_register_dto.phone; }
        else { console.log('delete'); delete user_insert.phone; }
        const result = await user_insert.save();

        const verificationCode = generateRandomNumber(6).toString();
        await this._regVerify.create({
            userId: user_insert.userId,
            email: user_insert.email ? user_insert.email : "",
            verificationCode: verificationCode,
            isConfirmed: false,
            updatedAt: Date.now()
        })


        const token = get_token(user_insert.userId);
        const token_insert = new this._tokenModel({
            token: token,
            userId: user_insert.userId
        });
        await token_insert.save();
        const _return = {
            ...result.toJSON(),
            token: token
        };
        console.log('user - insert - result');
        console.log(_return);
        return _return;
        //send email with the verification code
        //insert in verification collection
    }
    async createUserWithGoogle(google_user: user_google_insert_dto, role: string) {
        console.log('createUserWithGoogle');
        console.log(google_user);
        const user_insert = {
            name: google_user.firstName + " " + google_user.lastName,
            email: google_user.email,
            profileImage: google_user.profileImg.original ? google_user.profileImg.original : google_user.profileImg.thumbnail,
            role: role,
            authMethod: AuthMethods.GOOGLE,
            isVerified: true,
            authCredentials: {
                googleId: google_user.googleId
            }
        };

        if (!await this.findOne({ "authCredentials.googleId": google_user.googleId })) {
            user_insert['userId'] = generateUUID();
        }
        const result = await this._userModel.findOneAndUpdate({
            "authCredentials.googleId": google_user.googleId
        }, user_insert, { upsert: true, new: true })


        // const result = await user_insert.save();
        const token = get_token(user_insert['userId']);
        const token_insert = new this._tokenModel({
            token: token,
            userId: user_insert['userId']
        });
        await token_insert.save();
        const _return = {
            ...result.toJSON(),
            token: token
        };
        console.log('user - insert - result');
        console.log(_return);
        return _return;
    }


    async createUserWithGithub(github_user: user_github_insert_dto, role: string) {
        console.log('createUserWithGitHub');
        console.log(github_user);
        const user_insert = {
            name: github_user.name,
            email: github_user.email,
            profileImage: github_user.avatar_url,
            bio: github_user.bio,
            location: github_user.location,
            role: role,
            authMethod: AuthMethods.GITHUB,
            isVerified: true,
            authCredentials: {
                id: github_user.id,
                type: github_user.type,
                followers: github_user.followers,
                following: github_user.following,
                node_id: github_user.node_id,
            }
        };

        if (!await this.findOne({ "authCredentials.id": github_user.id })) {
            user_insert['userId'] = generateUUID();
        }
        const result = await this._userModel.findOneAndUpdate({
            "authCredentials.id": github_user.id
        }, user_insert, { upsert: true, new: true })

        // const result = await user_insert.save();
        const token = get_token(user_insert['userId']);
        const token_insert = new this._tokenModel({
            token: token,
            userId: user_insert['userId']
        });
        await token_insert.save();
        const _return = {
            ...result.toJSON(),
            token: token
        };
        console.log('user - insert - result');
        console.log(_return);
        return _return;
    }


    async findOne(query) {
        const user = await this._userModel.findOne(query);
        if (user) {
            return user.toJSON()
        }
        return user;
    }

    async insertNewPassword(userId: string, newPassword: string) {
        const hashNewPassword = await getHashed(newPassword)
        return await this._userModel.findOneAndUpdate({ userId: userId }, { password: hashNewPassword })
    }

    async resetPassword(email: string, oldPassword: string, newPassword: string) {
        const hashOldPassword = await getHashed(oldPassword)
        console.log(hashOldPassword)
        const hashNewPassword = await getHashed(newPassword)

        const foundEmail = await this.findOne({ email: email });
        if (!foundEmail)
            throw new NotFoundException({ message: 'email not found' });

        if (!await comparePasswords(oldPassword, foundEmail.password))
            throw new NotFoundException({ message: 'wrong old password' });

        return await this._userModel.findOneAndUpdate({ email: email }, { password: hashNewPassword })
    }


    async checkLoginCredintials(email: string, password: string) {
        const foundEmail = await this.findOne({ email: email });
        if (!foundEmail)
            throw new NotFoundException({ message: 'email not found' });

        if (!foundEmail.isVerified)
            throw new NotFoundException({ message: 'email should be verified first' });

        if (!await comparePasswords(password, foundEmail.password))
            throw new NotFoundException({ message: 'wrong password' });

        const token = get_token(foundEmail.userId);
        const token_insert = new this._tokenModel({
            token: token,
            userId: foundEmail.userId
        });
        await token_insert.save();
        delete foundEmail.password;
        const _return = {
            ...foundEmail,
            token: token
        };
        return _return;
    }

    async verifyCode(verify_password_dto: verify_password_update_dto) {
        const { foundUser } = await this._checkUserExistenceThenGet(verify_password_dto);
        const _verifyCode = await this._regVerify.findOne({ userId: foundUser.userId });
        if (String(_verifyCode.verificationCode) !== String(verify_password_dto.verificationCode))
            throw new ConflictException({ message: "worng verification code" });

        await this._userModel.findOneAndUpdate({ userId: foundUser.userId }, { isVerified: true });
        await this._regVerify.deleteOne({ userId: foundUser.userId });
    }

    private async _checkUserExistenceThenGet(createdBody: { email: string }) {
        const foundUser = await this.findOne({ email: createdBody.email });
        if (!foundUser)
            throw new NotFoundException({ message: 'email not found' });

        return { foundUser, parsedEmail: createdBody.email };
    }

    async updateUser(token: string, user_update_dto: userUpdateDTO) {
        console.log('update user basic');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        return await this._userModel.findOneAndUpdate({
            userId: userId
        }, user_update_dto, { upsert: false, new: true });

        // const user_insert = new this._userModel({
        //     userId: generateUUID(),
        //     name: user_register_dto.name,
        //     title: user_register_dto.title,
        //     password: await getHashed(user_register_dto.password),
        //     location: user_register_dto.location,
        //     languages: user_register_dto.languages,
        //     skills: user_register_dto.skills,
        //     bio: user_register_dto.bio,
        //     experience: user_register_dto.experience,
        //     currentCompany: user_register_dto.currentCompany,
        //     education: user_register_dto.education,
        //     doneClientsCount: user_register_dto.doneClientsCount,
        //     role: user_register_dto.role,
        //     authMethod: AuthMethods.LOCAL,
        //     isVerified: false
        // });
        // if (user_register_dto.email != null) { user_insert.email = user_register_dto.email; }
        // if (user_register_dto.phone != null) { user_insert.phone = user_register_dto.phone; }
        // const result = await user_insert.save();

        // const verificationCode = generateRandomNumber(6).toString();
        // await this._regVerify.create({
        //     userId: user_insert.userId,
        //     verificationCode: verificationCode,
        //     isConfirmed: false,
        //     updatedAt: Date.now()
        // })


        // const token = get_token(user_insert.userId);
        // const token_insert = new this._tokenModel({
        //     token: token,
        //     userId: user_insert.userId
        // });
        // await token_insert.save();
        // const _return = {
        //     ...result.toJSON(),
        //     token: token
        // };
        // console.log('user - insert - result');
        // console.log(_return);
        // return _return;
        //send email with the verification code
        //insert in verification collection
    }
}
