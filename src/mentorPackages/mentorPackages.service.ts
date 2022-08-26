/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MENTOR_PACKAGE_MODEL_NAME, TOKEN_MODEL_NAME } from 'src/common/constants';

import { IMentorPackage } from '../models/mentorPackages.model';
import { IToken } from '../models/auth/tokens.model';
import packageInsertDTO from './DTOs/package.insert';
import { generateUUID } from 'src/common/utils/generalUtils';
import packageUpdateDTO from './DTOs/package.update';





@Injectable()
export class MentorPackagesService {
    constructor(@InjectModel(MENTOR_PACKAGE_MODEL_NAME) private _packageModel: Model<IMentorPackage>,
        @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>) { }

    async createPackage(token: string, package_insert_dto: packageInsertDTO) {
        console.log('create package');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;

        //check the same package type exist before
        const foundPkg = await this.findOne({ mentorId: userId, packageType: package_insert_dto.packageType });
        if (foundPkg)
            throw new ConflictException({ message: `mentor already have ${package_insert_dto.packageType} package type`  });


        const package_insert = new this._packageModel({
            mentorId: userId,
            packageId: generateUUID(),
            features: package_insert_dto.features,
            packageType: package_insert_dto.packageType,
            price: package_insert_dto.price,
            currency: package_insert_dto.currency,
            updatedAt: Date.now()
        });
        const result = await package_insert.save();
        return result;
    }
    


    async update(packageId: string, package_update_dto: packageUpdateDTO) {
        console.log('update package');
        return await this._packageModel.findOneAndUpdate({
            packageId: packageId
        }, package_update_dto, { upsert: false, new: true });
    }

    async delete(packageId: string) {
        console.log('delete package');
        return await this._packageModel.findOneAndDelete({ packageId: packageId });
    }

    async findSelfPackages(token: string) {
        console.log('find self package');
        let userId = "";
        // get user id from token
        const foundToken = await this._tokenModel.findOne({ token: token });
        userId = foundToken.userId;
        return await this._packageModel.find({ mentorId: userId });
    }

    async findByMentorId(mentor_id: string) {
        console.log('find mentor package');
        return await this._packageModel.find({ mentorId: mentor_id });
    }

    async findOne(query) {
        const pkg = await this._packageModel.findOne(query);
        if (pkg) {
            return pkg.toJSON()
        }
        return pkg;
    }
}
