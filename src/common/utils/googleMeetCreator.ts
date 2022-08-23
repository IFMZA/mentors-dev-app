/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */

import googleMeetResponseDTO from "src/sessions/DTOs/google.meet.response";

const Meeting = require('google-meet-api').meet;
export async function create_session_meeting(date: string, startTime: string, meeting_duration: number, time_zone: string) {
    const _response = new googleMeetResponseDTO();
    const moment = require('moment-timezone');
    console.log('create_session_meeting')
    const start = date + "T" + startTime;
    console.log(start)
    console.log(meeting_duration)
    const newDateObj = moment.tz(start, time_zone).format();
    const newDateObj_2 = moment.tz(start, time_zone).add(meeting_duration, 'm').format();
    const starting_at = newDateObj;
    const ending_at = newDateObj_2;

    console.log('going')
    const result = await Meeting('create', {
        clientId: '761180003671-ggq7q15dt9mf9m2hmilmar06tj7b0j2a.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04FmxtmpaMYN7CgYIARAAGAQSNwF-L9IrN_GovgFzTbK6pnGePg7fa6HE_YO35GQ5ZNCpoFlHGtrT9xXBOiMfIc-auBpfK3kNLDg',
        date: date,
        time: startTime,
        meeting_duration: meeting_duration,
        timeZone: time_zone,
        starting_at: starting_at,
        ending_at: ending_at,
        summary: 'test summary',
        location: 'test location',
        description: 'test description',
        attendeesEmails: [
            { 'email': 'islam.farid16@gmail.com' },
            { 'email': 'markos.bahgat@gmail.com' }
        ]
    })
    _response.meet_link = result.data.hangoutLink ? result.data.hangoutLink : ""
    _response.event_id = result.data.id ? result.data.id : ""
    _response.start = result.data.start && result.data.start.dateTime ? result.data.start.dateTime : ""
    _response.end = result.data.end && result.data.end.dateTime ? result.data.end.dateTime : ""
    _response.busy = result.data.busy ? result.data.busy : false
    return _response;
}


export async function delete_session_meeting(event_id: string) {
    const _response = new googleMeetResponseDTO();
    const result = await Meeting('delete', {
        clientId: '761180003671-ggq7q15dt9mf9m2hmilmar06tj7b0j2a.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04FmxtmpaMYN7CgYIARAAGAQSNwF-L9IrN_GovgFzTbK6pnGePg7fa6HE_YO35GQ5ZNCpoFlHGtrT9xXBOiMfIc-auBpfK3kNLDg',
        eventId: event_id
    });
    _response.meet_link = result.data.hangoutLink ? result.data.hangoutLink : ""
    _response.event_id = result.data.id ? result.data.id : ""
    _response.start = result.data.start && result.data.start.dateTime ? result.data.start.dateTime : ""
    _response.end = result.data.end && result.data.end.dateTime ? result.data.end.dateTime : ""
    _response.busy = result.data.busy ? result.data.busy : false
    return _response;
}