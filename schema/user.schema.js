const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordToken: {
      // New field for password reset token
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const userCollection = mongoose.model('User', userSchema);

module.exports = { userCollection };
