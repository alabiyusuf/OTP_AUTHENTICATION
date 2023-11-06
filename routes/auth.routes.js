const express = require('express');
const { userCollection } = require('../schema/user.schema');
const router = express.Router();
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const { forgetPasswordCollection } = require('../schema/forgotPassword.schema');
const { send } = require('../utilities/sendEmail.js');
const { sendOTP } = require('../utilities/sendOtp.js');
const crypto = require('crypto-js');
const { OTPCollection } = require('../schema/otp.schema.js');
const { generateOTP } = require('../utilities/generateOTP.js');
const { trusted } = require('mongoose');

let encryptionMethod = 'AES-256-CBC';

router.post('/register', async (req, res) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  try {
    const newUser = await userCollection.create({
      userName: req.body.userName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: `New user has been created successfully`,
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Error encountered while trying to create a user.`,
      error,
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDetails = await userCollection.findOne({
      userName: req.body.userName,
    });
    if (!userDetails)
      return res.status(404).json({ message: `User not found`, userDetails });

    const doesPasswordMatch = bcrypt.compareSync(
      req.body.password,
      userDetails.password
    );

    if (!doesPasswordMatch)
      return res.status(400).json({ message: `Invalid login details` });

    const token = jwt.sign(
      {
        userName: userDetails.userName,
        email: userDetails.email,
        userId: userDetails._id,
      },
      process.env.SECRET
    );
    return res.status(200).json({ message: `Sign-in successful.`, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Error, check user details`, error });
  }
});

router.post('/forget-password', async (req, res) => {
  try {
    const { email } = req.body;

    const userDetails = await userCollection.findOne({
      email,
    });

    if (!userDetails) {
      throw Error(`User details not accurate`);
    }
    const otp = generateOTP();

    const encryptedUser = crypto.AES.encrypt(
      JSON.stringify({ userId: userDetails._id, otp }),
      process.env.ENCRYPTION_SECRET
    );

    await forgetPasswordCollection.create({
      userId: userDetails._id,
      otp,
      token: encryptedUser,
    });

    await send.sendMail({
      to: email,
      subject: `OTP Password Reset`,
      html: `
      <div>
        <h1> OTP Password Reset</h1>
        // <div><p></p>
        <p style="color: tomato; font-size: 25px; letter-spacing: 2px">
          <b>${encryptedUser}</b>, <b>${otp}</b>
        </p>
        <p>This code <b>expires in 1 hour(s)</b>.</p>
      </div>
      `,
    });

    res.status(200).send(`Message sent successfully.`);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put('/reset-password', async (req, res) => {
  const { token, otp, password } = req.body;

  const decryptedString = JSON.parse(
    crypto.AES.decrypt(token, process.env.ENCRYPTION_SECRET).toString(
      crypto.enc.Utf8
    )
  );

  if (!decryptedString) {
    throw new Error(`Token not valid.`);
  }

  const validatedUser = await forgetPasswordCollection.findOne({
    userId: decryptedString.userId,
    otp,
  });

  if (!validatedUser) {
    throw new Error(`User not validated`);
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await userCollection.findByIdAndUpdate(
    validatedUser.userId,
    {
      password: hashedPassword,
    },
    { new: true }
  );

  await forgetPasswordCollection.findOneAndDelete({ token, otp });

  res.send(`Password changed successfully`);
});

router.put('/password-reset', async (req, res) => {
  try {
    const { newPassword, encryptedId, encryptedMessage, otp } = req.body;

    const decryptedId = decrypt_string(encryptedId, encryptionMethod, key, iv);
    const decryptedMessage = decrypt_string(
      encryptedMessage,
      encryptionMethod,
      key,
      iv
    );

    if (!decryptedId || !decryptedMessage) {
      return res.status(400).json({ message: `Invalid encrypted data` });
    }

    if (!ObjectId.isValid(decryptedId)) {
      return res.status(400).json({ message: `Invalid user ID` });
    }

    const userDetails = await userCollection.findOne({ _id: decryptedId });
    if (!userDetails) {
      return res.status(400).json({ message: `Invalid user ID` });
    }

    const newHashedPassword = bcrypt.hashSync(
      newPassword,
      bcrypt.genSaltSync(10)
    );

    await userCollection.findByIdAndUpdate(user.userId, {
      password: newHashedPassword,
    });

    await forgetPasswordCollection.findOneAndDelete({
      token: decryptedMessage,
    });

    res.status(200).json({
      message: `Password changed successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;
