const generateOTP = () => {
  try {
    let otp;
    return (otp = `${Math.floor(100000 + Math.random() * 900000)}`);
  } catch (error) {
    throw new Error();
  }
};

module.exports = { generateOTP };
