const { google } = require('googleapis');
const axios = require("axios");
const gmail = google.gmail('v1');
const { getUsersConnectedToAService } = require("../../pocketbase/database");
const {gmailNewMail} = require("../../routes");

async function markEmailAsProcessed(userToken, emailId) {
    const baseURL = process.env.NODE_APP_GMAIL_API_URL;
    const emailURL = `${baseURL}/users/me/messages/${emailId}/modify`;
    
    try {
        const updateResponse = await axios.post(emailURL, {
            "removeLabelIds": ["UNREAD"]
        }, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (updateResponse.status === 200) {
            console.log('Email marked as processed.');
            return updateResponse.data;
        } else {
            console.error('Error marking the email.');
            return null;
        }
    } catch (error) {
        console.error('Mark email error:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function getEmailsFromLastMinute(token) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: token
    });

    const currentTime = Date.now();
    const oneMinuteAgo = new Date(currentTime - 60 * 1000);
    const query = `after:${Math.floor(oneMinuteAgo.getTime() / 1000)} is:unread`;

    try {
        const response = await gmail.users.messages.list({
            userId: 'me',
            q: query,
            auth: oauth2Client
        });

        const emails = response.data.messages;
        return emails || [];
    } catch (error) {
        console.log('Error fetching emails:', error);
        return null;
    }
}

async function getEmailContent(token, emailId) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: token
    });

    try {
        const response = await gmail.users.messages.get({
            userId: 'me',
            id: emailId,
            auth: oauth2Client
        });

        const emailData = response.data;

        const subjectHeader = emailData.payload.headers.find(header => header.name === "Subject");
        const subject = subjectHeader ? subjectHeader.value : null;

        const fromHeader = emailData.payload.headers.find(header => header.name === "From");
        const fromEmail = fromHeader ? fromHeader.value : null;

        const toHeader = emailData.payload.headers.find(header => header.name === "To");
        const toEmail = toHeader ? toHeader.value : null;
    
        let body = "";
        if (emailData.payload.body.size > 0) {
            body = Buffer.from(emailData.payload.body.data, 'base64').toString('utf8');
        } else if (emailData.payload.parts && emailData.payload.parts.length > 0) {
            body = Buffer.from(emailData.payload.parts[0].body.data, 'base64').toString('utf8');
        }

        return { subject, body, fromEmail, toEmail };
    } catch (error) {
        console.log('Error fetching email content:', error);
        return null;
    }
}

async function getAllEmailsFromLastMinute() {
    const all_google_user = await getUsersConnectedToAService("Google");

    if (all_google_user.totalItems == 0) {
        return;
    }
    try {
        await Promise.all(all_google_user.items.map(async element => {
            const emails = await getEmailsFromLastMinute(element.encrypted_credentials);
            if (emails && Array.isArray(emails)) {
                await Promise.all(emails.map(async (email) => {
                    await markEmailAsProcessed(element.encrypted_credentials, email.id);
                    const {subject, body, fromEmail, toEmail} = await getEmailContent(element.encrypted_credentials, email.id);
                    gmailNewMail(subject, body, fromEmail, toEmail);
                }));
            }
        }));
    } catch(e) {
        console.log("Error during get all emails from last minute: " + e.message);
    }
}

module.exports = {
    getAllEmailsFromLastMinute
}
