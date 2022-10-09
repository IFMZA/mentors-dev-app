/* eslint-disable prettier/prettier */

import { IMAGES_UPLOAD_PATH } from 'src/common/constants';

export function generateUUID(): string {
    let u = "";
    const m = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let i = 0;
    let rb = Math.random() * 0xffffffff | 0;

    while (i++ < 36) {
        const c = m[i - 1];
        const r = rb & 0xf;
        const v = c == "x" ? r : (r & 0x3 | 0x8);
        u += (c == "-" || c == "4") ? c : v.toString(16);
        rb = i % 8 == 0 ? Math.random() * 0xffffffff | 0 : rb >> 4;
    }
    return u;
}

export const generateRandomNumber = (digits: number) => {
    return Math.floor(Math.random() * (9 * Math.pow(10, digits - 1))) + Math.pow(10, digits - 1);
}


export const getImagePath = (base_url: string, image_name: string): string => {
    if (image_name == null ||
        image_name == undefined ||
        image_name == "") {
        return "No_Image";
    }
    else if (image_name.includes('http')) {
        return image_name;
    }
    else {
        const full_path = (base_url + image_name).replace("\\", "/");
        return full_path;
    }
}