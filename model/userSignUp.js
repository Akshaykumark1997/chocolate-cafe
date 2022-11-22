const mongoose = require('mongoose');
const Schema = mongoose.Schema

var validateEmail = function(email) {
    var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var validateName = function(name) {
    return /^[a-zA-Z]+$/.test(name);
  };

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      validate: [validateName, "please fill a valid name"],
      match: [/^[a-zA-Z]+$/, "please fill a valid name"],
    },
    email: {
      type: String,
      required: true,
      validate: [validateEmail, "please fill valid email"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    mobile:{
      type:Number,
      required:true,
      enum:10,
    },
    password: {
      type: String,
      required: true,
    },
  });
const user = mongoose.model('userDetails',userSchema);
module.exports = user;