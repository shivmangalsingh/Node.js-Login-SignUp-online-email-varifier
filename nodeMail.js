const nodemailer = require('nodemailer');
const { google } = require('googleapis');
//const { gmail } = require('googleapis/build/src/apis/gmail');
const { config } = require('dotenv');
config();
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
async function sendMail(email, key) {
    try {
        const accsessToken = await oAuth2Client.getAccessToken();
        const code = 'http://localhost:1290/verifying/' + key;
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'ronaldmmm2050@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accsessToken
            }
        });
        const mailOptions = {
            from: 'ronaldmmm2050@gmail.com',
            to: email,
            subject: 'Varify your Account!',
            text: 'Hello from Node.js',
            html: `<p>To confirm your account,click this <a href=${code}>link</a></p>`
        };
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (err) {
        return err;
    }
}

module.exports.sendMail = sendMail;