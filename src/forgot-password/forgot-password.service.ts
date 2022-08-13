/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FORGOT_PASSWORD_MODEL_NAME } from 'src/common/constants';
import { generateRandomNumber } from 'src/common/utils/generalUtils';

// import { IToken } from 'src/models/auth/tokens.model';
// import { IRegistrationVerification } from 'src/models/auth/registerationVerification.model';
// import userRegisterDTO from './DTOs/user.register';

import { IForgotPassword } from 'src/models/auth/forgotPassword.model';

import { UsersService } from 'src/users/users.service';
import forgot_password_insert_dto from './DTOs/forgot-password.insert';
import verify_password_update_dto from './DTOs/verify-password.update';




@Injectable()
export class ForgotPasswordService {
    constructor(@InjectModel(FORGOT_PASSWORD_MODEL_NAME) private _forgotPassModel: Model<IForgotPassword>,
        private readonly _userServise: UsersService) { }


    async forgetPassword(forgot_password_dto: forgot_password_insert_dto) {
        console.log('forgot_password_dto');
        console.log(forgot_password_dto);
        const { foundUser, parsedEmail } = await this._checkUserExistenceThenGet(forgot_password_dto);
        await this._forgotPassModel.findOneAndDelete({ userId: foundUser.userId });
        console.log('deleted')
        const verificationCode = generateRandomNumber(6).toString();
        //Send Email with verification code
        await this._forgotPassModel.create({
            userId: foundUser.userId,
            verificationCode: verificationCode,
            isConfirmed: false,
            updatedAt: Date.now()
        })
    }

    async verifyCode(verify_password_dto: verify_password_update_dto) {
        const { foundUser } = await this._checkUserExistenceThenGet(verify_password_dto);
        const _forgotPassword = await this._forgotPassModel.findOne({ userId: foundUser.userId });
        if (String(_forgotPassword.verificationCode) !== String(verify_password_dto.verificationCode))
            throw new ConflictException({ message: "worng verification code" });

        await this._forgotPassModel.findOneAndUpdate({ userId: foundUser.userId }, { isConfirmed: true })

    }

    async createNewPassword(createdBody: { password: string, email: string }) {
        const { foundUser } = await this._checkUserExistenceThenGet(createdBody);
        const forgetPassword = await this._forgotPassModel.findOne({ userId: foundUser.userId, confirmed: true });
        if (!forgetPassword)
            throw new BadRequestException({ message: 'verification code should be confirmed first' });
        await this._userServise.insertNewPassword(foundUser.userId, createdBody.password)
        await this._forgotPassModel.deleteOne({ userId: foundUser.userId });
    }




    private async _checkUserExistenceThenGet(createdBody: { email: string }) {
        const foundUser = await this._userServise.findOne({ email: createdBody.email });
        if (!foundUser)
            throw new NotFoundException({ message: 'email not found' });

        return { foundUser, parsedEmail: createdBody.email };
    }


}
