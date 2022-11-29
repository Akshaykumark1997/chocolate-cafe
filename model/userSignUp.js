const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    match: [/^[a-zA-Z]+$/, "please fill a valid name"],
  },
  username: {
    type: String,
    required: true,
    match: [/^[a-zA-Z]+$/, "please fill a valid name"],
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  mobile: {
    type: Number,
    required: true,
    min: 10,
  },
  addressDetails: [
    {
      housename: {
        type: String,
      },
      area: {
        type: String,
      },
      landmark: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
    },
  ],
  password: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});
const user = mongoose.model("userDetails", userSchema);
module.exports = user;
