const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordResetSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

const forgetPasswordCollection = mongoose.model(
  'forgetPassword',
  passwordResetSchema
);

module.exports = { forgetPasswordCollection };
