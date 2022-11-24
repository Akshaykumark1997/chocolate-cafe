 const client = require("twilio")(
   "ACb931a3e463d3bd328719f7ed1b2a8e23",
   "594c5671f8a048a20559c60d060b4519"
 ); 
 
 module.exports = {
 sendOTP:(number, otp) =>{
  client.messages
    .create({
      to: number,
      from: "+13514449787",
      body: `your otp is ${otp}`,
    })
    .then((messages) => {
      console.log(`message SID${messages.sid}`);
    })
    .catch((error) => {
      console.log(error);
    });
}
}


