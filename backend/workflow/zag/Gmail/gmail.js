const { google } = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');
const { getUserInfo, getUserCredentialInfo, getServiceId } = require('../../pocketbase/database');

async function sendEmail(userId, message) {
  const google_service_id = await getServiceId("Google")
  const token = await getUserCredentialInfo(userId, google_service_id);
  const user_info = await getUserInfo(userId);
  console.log(user_info);
  if (user_info.email && google_service_id && token) {
    if (user_info.email && google_service_id && token) {
      const options = {
        to: user_info.email,
        subject: "Zigzag notification",
        text: message,
        textEncoding: 'base64',
        headers: [
          { key: 'X-Application-Developer', value: 'Amit Agarwal' },
          { key: 'X-Application-Version', value: 'v1.0.0.2' },
        ],
      };
      const messageId = await sendMail(token.encrypted_credentials, options);
      console.log(messageId)
    } else {
      console.log("Cannot send email: user info, google service id or token are missing.");
    }
  };
}

const getGmailService = (userToken) => {
  const client_secret = process.env.NODE_APP_GOOGLE_SECRET
  const client_id = process.env.NODE_APP_GOOGLE_ID_CLIENT;
  redirect_uris = process.env.NODE_APP_GOOGLE_REDIRECT;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials({
    access_token: userToken
  });
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  return gmail;
};

const encodeMessage = (message) => {
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendMail = async (userCredential, options) => {
  const gmail = getGmailService(userCredential);
  const rawMessage = await createMail(options);
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: rawMessage,
    },
  });
  return id;
};


module.exports = {
  sendEmail
};