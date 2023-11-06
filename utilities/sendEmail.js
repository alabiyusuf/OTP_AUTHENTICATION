const sendMail = require('nodemailer');
require(`dotenv`).config();
const username = process.env.USER;
const password = process.env.PASS;

const options = {
  service: 'gmail',
  auth: {
    user: `beyionikoyi@gmail.com`,
    pass: `dgrphnghstztipqd`,
  },
};

const send = sendMail.createTransport(options);

module.exports = { send };
