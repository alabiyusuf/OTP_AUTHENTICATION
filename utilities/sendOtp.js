const { OTPCollection } = require('../schema/otp.schema.js');
const { generateOTP } = require('./generateOTP.js');
const { send } = require('./sendEmail.js');

const sendOTP = async ({ email, subject, message, duration = 1 }) => {
  try {
    if (!(email && subject && message)) {
      throw Error(`Provide values for email, subject and message`);
    }

    await OTPCollection.deleteOne({ email });

    const generatedOTP = await generateOTP();

    await send.sendMail({
      to: email,
      subject: `OTP Password Reset`,
      html: `
        <div>
          <h1> OTP Password Reset</h1>
          <div><p>${message}</p>
          <p style="color: tomato; font-size: 25px; letter-spacing: 2px">
            <b>${generatedOTP}</b>
          </p>
          <p>This code <b>expires in ${duration} hour(s)</b>.</p>
        </div>
        `,
    });

    const newOTP = await new OTPCollection({
      email,
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * +duration,
    });

    const createdOTPRecord = await newOTP.save();
    return createdOTPRecord;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendOTP };
