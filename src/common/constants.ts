/* eslint-disable prettier/prettier */
export const TOKEN_MODEL_NAME = 'token';
export const REGISTERATION_VERIFICATION_MODEL_NAME = "registerverify";
export const USER_MODEL_NAME = "user";
export const FORGOT_PASSWORD_MODEL_NAME = "forgotPassword";
export const MENTOR_PACKAGE_MODEL_NAME = "mentor-package";
export const MENTOR_AVAILABLE_SLOT_MODEL_NAME = "mentor-slots";
export const SESSION_MODEL_NAME = "mentor-session";
export const NOTIFICATION_MODEL_NAME = "notification";
export const MESSAGE_MODEL_NAME = "messages";
export const IMAGES_UPLOAD_PATH = "files";



export const COMMENT_MODEL_NAME = "comment";
export const COMMENT_LIKE_MODEL_NAME = "comment-like";
export const REPLY_MODEL_NAME = "reply";
export const REPLY_LIKE_MODEL_NAME = "reply-like";

export const REVIEW_MODEL_NAME = "review";


export const MENTORS_LIST_PAGE_SIZE = 30;
export const COMMENTS_LIST_PAGE_SIZE = 5;
export const REVIEWS_LIST_PAGE_SIZE = 30;



export enum MentorOrderByProperties {
    RATING = 'rating',
    CREATION = 'creation',
    ALPHA = 'alpha',
}

export enum OrderByOrdering {
    DESC = 'desc',
    ASC = 'asc'
}


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


export enum notificationType {
    SESSION_RESERVATION = "session_reservation",
    NEW_REVIEW = "new_review"
}

export const notificationTemplates = [
    {
        type: "session_reservation",
        title: "new session reservation",
        body: "new session reservation from {name}"
    }, {
        type: "new_review",
        title: "new review",
        body: "new review from {name}"
    }
];


export enum currencies {
    EGP = "EGP",
    DZD = "DZD",
    BHD = "BHD",
    IQD = "IQD",
    JOD = "JOD",
    KWD = "KWD",
    TND = "TND",
    AED = "AED",
    MAD = "MAD",
    LBP = "LBP",
    SDG = "SDG",
    SYP = "SYP",
    OMR = "OMR",
    QAR = "QAR",
    SAR = "SAR",
    YER = "YER",
    ILS = "ILS"
}



export enum skills {
    html = "html",
    css = "css",
    javascript = "javascript",
    scss = "scss",
    lass = "lass",
    java = "java",
    angular = "angular",
    react = "react",
    vue = "vue",
    nextjs = "nextjs",
    nuxtjs = "nuxtjs",
    remix = "remix",
    frontend = "front end",
    backend = "back end",
    fullstack = "full stack",
    devops = "devops",
    nodejs = "nodejs",
    nestjs = "nestjs",
    restfulapis = "restful apis",
    graphql = "graphql",
    cyperSecurity = "cyper security",
    uiuxDesign = "ui/ux design",
    typescript = "typescript",
    python = "python",
    rust = "rust",
    swift = "swift",
    iosDevelopement = "ios developement",
    andriodDevelopment = "andriod development",
    objectiveC = "objective-c",
    kotlin = "kotlin",
    reactNative = "react native",
    flutter = "flutter",
    dart = "dart",
    django = "django",
    cPlusPlus = "c++",
    machineLearning = "machine learning",
    dataScientest = "data scientest",
    ai = "ai",
    deepLearning = "deep learning",
    automation = "automation",
    testing = "testing",
    unitTesting = "unit testing",
    integrationTesting = "integration testing",
    endToEndTesting = "end to end testing",
    git = "git",
    github = "github",
    agaile = "agaile",
    documentation = "documentation",
    cvReview = "cv Review",
    projectDeployment = "project deployment",
    projectManagement = "project management",
    businessDevelopment = "business development",
    freelancing = "freelancing",
    redux = "redux",
    reduxToolkit = "redux toolkit",
    webpack = "webpack",
    vite = "vite",
    tailwindCss = "tailwind-css",
    bootstrap = "bootstrap",
    laravel = "laravel",
    php = "php",
    shopifyDevelopment = "shopify development",
    linux = "linux",
    ubentu = "ubentu",
    bugBounty = "bug bounty",
    penetrationTesting = "penetration testing",
    webDevelopment = "web development",
    desktopDevelopment = "desktop development",
    ionoc = "ionoc",
    elctron = "elctron"
}


export enum languages {
    English = "English",
    Arabic = "Arabic",
    French = "French",
    Germany = "Germany",
    russian = "russian",
    Chinese = "Chinese"
}