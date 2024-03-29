/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AppRoles,
  AuthMethods,
  MentorOrderByProperties,
  MENTORS_LIST_PAGE_SIZE,
  OrderByOrdering,
  REGISTERATION_VERIFICATION_MODEL_NAME,
  TOKEN_MODEL_NAME,
  USER_MODEL_NAME,
} from 'src/common/constants';

import { IUser } from '../models/users.model';
import { IRegistrationVerification } from 'src/models/auth/registerationVerification.model';
import { IToken } from '../models/auth/tokens.model';

import user_google_insert_dto from './DTOs/user.google.insert';
import userRegisterDTO from 'src/auth/DTOs/user.register';
import {
  generateRandomNumber,
  generateUUID,
  getImagePath,
} from 'src/common/utils/generalUtils';
import { comparePasswords, getHashed } from '../common/utils/hashPassword';
import { get_token } from 'src/common/auth/tokenGenerator';
import user_github_insert_dto from './DTOs/user.github.insert';
import verify_password_update_dto from 'src/forgot-password/DTOs/verify-password.update';
import userUpdateDTO from './DTOs/user.update';
import { sendEmailVerification_Template } from 'src/common/utils/emailSender';
import mentor_filter_dto from './DTOs/mentor.filter';
('../common/utils/emailSender');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USER_MODEL_NAME) private _userModel: Model<IUser>,
    @InjectModel(TOKEN_MODEL_NAME) private _tokenModel: Model<IToken>,
    @InjectModel(REGISTERATION_VERIFICATION_MODEL_NAME)
    private _regVerify: Model<IRegistrationVerification>,
  ) {}

  async createUserBasic(user_register_dto: userRegisterDTO) {
    //insert user in database with verified = false
    const user_insert = new this._userModel({
      userId: generateUUID(),
      name: user_register_dto.name,
      title: user_register_dto.title,
      password: await getHashed(user_register_dto.password),
      website: user_register_dto.website,
      preferredCurreny: user_register_dto.preferredCurreny,
      location: user_register_dto.location,
      languages: user_register_dto.languages,
      skills: user_register_dto.skills,
      bio: user_register_dto.bio,
      experience: user_register_dto.experience,
      currentCompany: user_register_dto.currentCompany,
      education: user_register_dto.education,
      role: user_register_dto.role,
      authMethod: AuthMethods.LOCAL,
      isVerified: false,
    });
    if (user_register_dto.email != null) {
      user_insert.email = user_register_dto.email;
    } else {
      console.log('delete');
      delete user_insert.email;
    }
    if (user_register_dto.phone != null) {
      user_insert.phone = user_register_dto.phone;
    } else {
      console.log('delete');
      delete user_insert.phone;
    }
    const result = await user_insert.save();

    const verificationCode = generateRandomNumber(6).toString();
    await this._regVerify.create({
      userId: user_insert.userId,
      email: user_insert.email ? user_insert.email : '',
      verificationCode: verificationCode,
      isConfirmed: false,
      updatedAt: Date.now(),
    });

    const token = get_token(user_insert.userId);
    const token_insert = new this._tokenModel({
      token: token,
      userId: user_insert.userId,
    });
    await token_insert.save();
    const _return = {
      ...result.toJSON(),
      token: token,
    };

    sendEmailVerification_Template(user_insert.email, verificationCode);
    return _return;
  }
  async createUserWithGoogle(
    base_url: string,
    google_user: user_google_insert_dto,
    role: string,
  ) {
    const found_user = await this.findOne({
      'authCredentials.googleId': google_user.googleId,
    });
    let _return = {};
    if (!found_user) {
      if (!role || role == '' || role == null) {
        throw new BadRequestException({ message: 'role not found' });
      }
      const user_insert = {
        userId: generateUUID(),
        name: google_user.firstName + ' ' + google_user.lastName,
        email: google_user.email,
        profileImage: google_user.profileImg.original
          ? google_user.profileImg.original
          : google_user.profileImg.thumbnail,
        authMethod: AuthMethods.GOOGLE,
        role: role,
        isVerified: true,
        authCredentials: {
          googleId: google_user.googleId,
        },
      };
      const result = await this._userModel.findOneAndUpdate(
        {
          'authCredentials.googleId': google_user.googleId,
        },
        user_insert,
        { upsert: true, new: true },
      );
      const token = get_token(user_insert['userId']);
      const token_insert = new this._tokenModel({
        token: token,
        userId: user_insert['userId'],
      });
      await token_insert.save();

      _return = {
        ...result.toJSON(),
        token: token,
      };
    } else {
      const token = get_token(found_user.userId);
      const token_insert = new this._tokenModel({
        token: token,
        userId: found_user.userId,
      });
      await token_insert.save();

      found_user.profileImage = getImagePath(base_url, found_user.profileImage);
      _return = {
        ...found_user,
        token: token,
      };
    }
    return _return;
  }

  async createUserWithGithub(
    base_url: string,
    github_user: user_github_insert_dto,
    role: string,
  ) {
    const found_user = await this.findOne({
      'authCredentials.id': github_user.id,
    });
    let _return = {};
    if (!found_user) {
      if (!role || role == '' || role == null) {
        throw new BadRequestException({ message: 'role not found' });
      }
      const user_insert = {
        name: github_user.name,
        email: github_user.email,
        profileImage: github_user.avatar_url,
        bio: github_user.bio,
        location: { country: github_user.location },
        authMethod: AuthMethods.GITHUB,
        isVerified: true,
        authCredentials: {
          id: github_user.id,
          type: github_user.type,
          followers: github_user.followers,
          following: github_user.following,
          node_id: github_user.node_id,
        },
      };
      user_insert['userId'] = generateUUID();
      user_insert['role'] = role;
      const result = await this._userModel.findOneAndUpdate(
        {
          'authCredentials.id': github_user.id,
        },
        user_insert,
        { upsert: true, new: true },
      );

      const token = get_token(user_insert['userId']);
      const token_insert = new this._tokenModel({
        token: token,
        userId: user_insert['userId'],
      });
      await token_insert.save();

      _return = {
        ...result.toJSON(),
        token: token,
      };
    } else {
      const token = get_token(found_user.userId);
      const token_insert = new this._tokenModel({
        token: token,
        userId: found_user.userId,
      });
      await token_insert.save();

      found_user.profileImage = getImagePath(base_url, found_user.profileImage);
      _return = {
        ...found_user,
        token: token,
      };
    }
    return _return;
  }

  async findOne(query) {
    const user = await this._userModel.findOne(query);
    if (user) {
      return user.toJSON();
    }
    return user;
  }

  async insertNewPassword(userId: string, newPassword: string) {
    const hashNewPassword = await getHashed(newPassword);
    return await this._userModel.findOneAndUpdate(
      { userId: userId },
      { password: hashNewPassword },
    );
  }

  async resetPassword(email: string, oldPassword: string, newPassword: string) {
    const hashOldPassword = await getHashed(oldPassword);
    const hashNewPassword = await getHashed(newPassword);

    const foundEmail = await this.findOne({ email: email });
    if (!foundEmail)
      throw new NotFoundException({ message: 'email not found' });

    if (!(await comparePasswords(oldPassword, foundEmail.password)))
      throw new NotFoundException({ message: 'wrong old password' });

    return await this._userModel.findOneAndUpdate(
      { email: email },
      { password: hashNewPassword },
    );
  }

  async checkLoginCredintials(email: string, password: string) {
    const foundEmail = await this.findOne({ email: email });
    if (!foundEmail)
      throw new NotFoundException({ message: 'email not found' });

    if (!foundEmail.isVerified)
      throw new NotFoundException({
        message: 'email should be verified first',
      });

    if (!(await comparePasswords(password, foundEmail.password)))
      throw new NotFoundException({ message: 'wrong password' });

    const token = get_token(foundEmail.userId);
    const token_insert = new this._tokenModel({
      token: token,
      userId: foundEmail.userId,
    });
    await token_insert.save();
    delete foundEmail.password;
    const _return = {
      ...foundEmail,
      token: token,
    };
    return _return;
  }

  async verifyCode(verify_password_dto: verify_password_update_dto) {
    const { foundUser } = await this._checkUserExistenceThenGet(
      verify_password_dto,
    );
    const _verifyCode = await this._regVerify.findOne({
      userId: foundUser.userId,
    });
    if (
      String(_verifyCode.verificationCode) !==
      String(verify_password_dto.verificationCode)
    )
      throw new ConflictException({ message: 'worng verification code' });

    await this._userModel.findOneAndUpdate(
      { userId: foundUser.userId },
      { isVerified: true },
    );
    await this._regVerify.deleteOne({ userId: foundUser.userId });
    return foundUser.role;
  }

  private async _checkUserExistenceThenGet(createdBody: { email: string }) {
    const foundUser = await this.findOne({ email: createdBody.email });
    if (!foundUser) throw new NotFoundException({ message: 'email not found' });

    return { foundUser, parsedEmail: createdBody.email };
  }

  async updateUser(
    token: string,
    user_update_dto: userUpdateDTO,
    base_url: string,
  ) {
    let userId = '';
    // get user id from token
    const foundToken = await this._tokenModel.findOne({ token: token });
    userId = foundToken.userId;

    const new_user = await this._userModel.findOneAndUpdate(
      {
        userId: userId,
      },
      user_update_dto,
      { upsert: false, new: true },
    );

    new_user.profileImage = getImagePath(base_url, new_user.profileImage);

    return new_user;
  }

  async getMentorById(base_url: string, mentor_id: string) {
    const found_user = await this.findOne({
      userId: mentor_id,
      role: AppRoles.MENTOR,
    });
    if (!found_user) {
      throw new NotFoundException({ message: 'user not found' });
    }
    found_user.profileImage = getImagePath(base_url, found_user.profileImage);
    return found_user;
  }

  async getDeveloperById(base_url: string, developer_id: string) {
    const found_user = await this.findOne({
      userId: developer_id,
      role: AppRoles.DEVELOPER,
    });
    if (!found_user) {
      throw new NotFoundException({ message: 'user not found' });
    }
    found_user.profileImage = getImagePath(base_url, found_user.profileImage);
    return found_user;
  }

  async getMentorsByFilterSort(
    base_url: string,
    mentor_filter: mentor_filter_dto,
  ) {
    const _skip = MENTORS_LIST_PAGE_SIZE * mentor_filter.pageId;

    const query = { role: AppRoles.MENTOR };
    let sortQuery = {};
    // eslint-disable-next-line prefer-const

    if (mentor_filter.sortBy) {
      if (mentor_filter.sortBy == MentorOrderByProperties.CREATION) {
        if (mentor_filter.sortOrder == OrderByOrdering.ASC) {
          sortQuery['createdAt'] = 1;
        }
        if (mentor_filter.sortOrder == OrderByOrdering.DESC) {
          sortQuery['createdAt'] = -1;
        }
      }
      if (mentor_filter.sortBy == MentorOrderByProperties.ALPHA) {
        if (mentor_filter.sortOrder == OrderByOrdering.ASC) {
          sortQuery['name'] = 1;
        }
        if (mentor_filter.sortOrder == OrderByOrdering.DESC) {
          sortQuery['name'] = -1;
        }
      }
      if (mentor_filter.sortBy == MentorOrderByProperties.RATING) {
        if (mentor_filter.sortOrder == OrderByOrdering.ASC) {
          sortQuery['rate'] = 1;
        }
        if (mentor_filter.sortOrder == OrderByOrdering.DESC) {
          sortQuery['rate'] = -1;
        }
      }
    } else {
      sortQuery = { createdAt: -1 };
    }
    if (mentor_filter.searchKeyword) {
      query['$or'] = [
        {
          name: { $regex: new RegExp(mentor_filter.searchKeyword.trim(), 'i') },
        },
        {
          title: {
            $regex: new RegExp(mentor_filter.searchKeyword.trim(), 'i'),
          },
        },
        {
          experience: {
            $regex: new RegExp(mentor_filter.searchKeyword.trim(), 'i'),
          },
        },
        {
          currentCompany: {
            $regex: new RegExp(mentor_filter.searchKeyword.trim(), 'i'),
          },
        },
        {
          bio: { $regex: new RegExp(mentor_filter.searchKeyword.trim(), 'i') },
        },
      ];
    }

    // if (mentor_filter.country) { query["location.country"] = { $regex: new RegExp(mentor_filter.country.trim(), 'i') } }
    if (mentor_filter.country) {
      query['location.country'] = {
        $in:
          typeof mentor_filter.country == 'string'
            ? [mentor_filter.country]
            : mentor_filter.country,
      };
    }
    if (mentor_filter.language) {
      query['languages'] = {
        $in:
          typeof mentor_filter.language == 'string'
            ? [mentor_filter.language]
            : mentor_filter.language,
      };
    }
    if (mentor_filter.skill) {
      query['skills'] = {
        $in:
          typeof mentor_filter.skill == 'string'
            ? [mentor_filter.skill]
            : mentor_filter.skill,
      };
    }
    if (mentor_filter.onlineStatus) {
      query['onlineStatus'] = mentor_filter.onlineStatus;
    }

    console.log('filter:');
    console.log(JSON.stringify(query));
    const found_users = await this._userModel
      .find(query, {}, { skip: _skip, limit: MENTORS_LIST_PAGE_SIZE })
      .sort(sortQuery);
    found_users.forEach((element) => {
      element.profileImage = getImagePath(base_url, element.profileImage);
    });
    return found_users;
  }
}
