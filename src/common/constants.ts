/* eslint-disable prettier/prettier */
export const TOKEN_MODEL_NAME = 'token';
export const REGISTERATION_VERIFICATION_MODEL_NAME = "registerverify";
export const USER_MODEL_NAME = "user";
export const FORGOT_PASSWORD_MODEL_NAME = "forgotPassword";
// export const GOOGLE_USER_MODEL_NAME = "google-user";
// export const SHOP_MODEL_NAME = 'shop';
// export const PHONE_REGISTER_MODEL_NAME = "phone-register";
// export const FORGET_PASSWORD_MODE_NAME = 'forget-password';
// export const FLOWER_MODEL_NAME = 'flower';



export enum AppRoles {
    MENTOR = "mentor",
    DEVELOPER = 'developer'
}


export enum AuthMethods {
    GOOGLE = "google",
    GITHUB = 'github',
    LOCAL = 'local'
}


export enum PackageTypes {
    MINUTES_15 = "15min",
    MINUTES_30 = "30min",
    HOURS_1 = "1hour",
}


export enum sessionStatus {
    COMPLETED = "completed",
    UPCOMING = "upcoming",
    CANCELED = "canceled"
}

export enum currencies {
    USD = 'usd',
    EGP = 'egp'
}

// export enum SortType {
//     DESCENDING = 'DESCENDING',
//     ASCENDING = 'ASCENDING',
// }