/* eslint-disable prettier/prettier */
export const TOKEN_MODEL_NAME = 'token';
export const REGISTERATION_VERIFICATION_MODEL_NAME = "registerverify";
export const USER_MODEL_NAME = "user";
export const FORGOT_PASSWORD_MODEL_NAME = "forgotPassword";
export const MENTOR_PACKAGE_MODEL_NAME = "mentor-package";
export const MENTOR_AVAILABLE_SLOT_MODEL_NAME = "mentor-slots";



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
