/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

// import sgMail from '@sendgrid/mail';

const sgMail = require('@sendgrid/mail');
import { REGISTRATION_EMAIL_VALIDATION } from '../email.templates';

const SENDGRID_API_KEY = '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';



export async function sendEmailVerification_Template(email, verify_code) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
    const msg = {
        to: email,
        from: 'support@techmentors.co',
        subject: 'Hello world',
        text: 'Hello plain world!',
        html: '<p>Hello HTML world!</p>',
        templateId: REGISTRATION_EMAIL_VALIDATION,
        substitutions: {
            name: email,
            verify_url: `http://localhost:3400/Users/verify/${email}&${verify_code}`
        },
    };

    console.log('xx')
    const xx = await sgMail.send(msg);
    console.log(xx)
    return "";
}