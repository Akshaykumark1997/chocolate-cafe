const dotenv = require("dotenv");

dotenv.config();

const client = require("twilio")(process.env.SID, process.env.AUTH);

module.exports = {
  sendOTP: (number, otp) => {
    client.messages
      .create({
        to: number,
        from: process.env.MOB,
        body: `your otp is ${otp}`,
      })
      .then((messages) => {
        console.log(`message SID${messages.sid}`);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
