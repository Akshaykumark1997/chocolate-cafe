const dotenv = require("dotenv");

dotenv.config();

// const client = require("twilio")(process.env.SID, process.env.AUTH);

// module.exports = {
//   sendOTP: (number, otp) => {
//     client.messages
//       .create({
//         to: number,
//         from: process.env.MOB,
//         body: `your otp is ${otp}`,
//       })
//       .then((messages) => {
//         console.log(`message SID${messages.sid}`);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, 
// };
const nodemailer = require("nodemailer");

module.exports = {
  mailTransporter: nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAILPASS,
    },
  }),

  OTP: `${Math.floor(1000 + Math.random() * 9000)}`,
};