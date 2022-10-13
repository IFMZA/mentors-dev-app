/* eslint-disable prettier/prettier */
import axios from "axios";

export async function send(toId: string, title: string, body: string) {
    const Headers = {
        'Authorization': 'key=AAAAsTndHVc:APA91bEBOUXucQbuUivHPhjmWchJJ6MGFp4zd897HCYk86ePm_cmZYJR4_AQgUnXRXGBwRxWeVvdfvZXCmtgHWch5WvfLEagUpmbUohsOJC78w6wI8RhEZPxFjghe0JyZDVOSUEJfPXE',
        'Content-Type': 'application/json',
    }
    const Body = {
        "notification": {
            "title": title,
            "body": body
        },
        "to": "/topics/" + toId,
        "data": {

            "type": "survey",

        }
    };



    const URL = 'https://fcm.googleapis.com/fcm/send';

    await axios({
        method: "post",
        url: URL,
        timeout: 4 * 1000, // Let's say you want to wait at least 4 mins
        data: Body,
        headers: Headers
    })
        .then(resp => console.log(resp))
        .catch(err => console.log(err));
}