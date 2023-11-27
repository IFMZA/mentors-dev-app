/* eslint-disable prettier/prettier */
import axios from "axios";

export async function send(toId: string, title: string, body: string) {
    const Headers = {
        'Authorization': 'key=000',
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