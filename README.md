RESET PASSWORD WITH OTP

An authentication app that allows sign up/register and logging in of users, a forget password route which generates an OTP and encrypted token before allowing existing users to be able to change their password on the reset password.

To install:

RUN: `npm install` in this cloned project directory terminal.

To start the project:
RUN: `npm run start`

Create a .env file in the project directory and add the following variables:

`PORT`, `MONGO_URI`, and `ENCRYPTION_SECRET`
To Register:

- Users are to sign up with: userName, email, phoneNumber and password.

To Login:

- Users are to login with : userName and password.

To Forget Password:

- Users are to access the forget password route with their email and a 6 digit token will be to the registered email and an encrypted OTP as well.

To Reset Password:

- Users are to provide the token, otp and input a new password as well.
