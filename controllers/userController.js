const User = require("../model/userSignUp");
const products = require("../model/product");
const otpsign = require("../model/otp");
const bcrypt = require("bcrypt");
const user = require("../model/userSignUp");
const sendOtp = require('../middleware/otpmiddleware.js');

let session;

module.exports = {
  guestHome: async (req, res) => {
    const allProducts = await products.find();
    res.render("user/userHome", { session, allProducts });
  },
  getLogin: (req, res) => {
    session = req.session.userId;
    if (session) {
      res.redirect("/userhome");
    } else {
      res.render("user/userLogin", { session });
    }
  },
  gethome: async (req, res) => {
    session = req.session.userId;
    if (session) {
      const allProducts = await products.find();
      console.log(allProducts);
      res.render("user/userHome", { session, allProducts });
    } else {
      res.redirect("/user");
    }
  },
  postLogin: async (req, res) => {
    let email = req.body.email;
    const userDetails = await User.findOne({ email: email });
    console.log(userDetails);
    const blocked = userDetails.isBlocked;
    console.log(blocked);
    if (blocked === false) {
      if (userDetails) {
        const value = await bcrypt.compare(
          req.body.password,
          userDetails.password
        );
        if (value) {
          req.session.userId = req.body.email;
          res.redirect("/userhome");
        } else {
          res.render("user/userLogin", {
            session,
            err_message: "email or password incorrect",
          });
        }
      } else {
        res.render("user/userLogin", {
          session,
          err_message: "email not registered",
        });
      }
    } else {
      res.render("user/userLogin", { session, err_message: "Blocked" });
    }
  },
  userLogout: async (req, res) => {
    req.session.destroy();
    res.redirect("/user");
  },
  getSignup: (req, res) => {
    res.render("user/userSignup", { session });
  },
  postSignup: async (req, res) => {
    const data = { ...req.body };
    if (data.password === data.confirmpassword) {
      User.find({ $or: [{ mobile: data.mobile }, { email: data.email }] }).then(
        (result) => {
          if (result.length) {
            res.render("user/userSignup", {
              session,
              err_message: "already resistered",
            });
          } else {
            user.find({ username: data.username }).then((result) => {
              if (result.length) {
                res.render("user/userSignup", {
                  session,
                  err_message: "username unavilable",
                });
              } else {
                const otpc = Math.floor(100000 + Math.random() * 900000);
                const tonumber = `+91${data.mobile}`;
                sendOtp.sendOTP(tonumber, otpc);
                const newOtp = new otpsign({
                  otp: otpc,
                });
                newOtp.save().then(() => {
                  res.render("user/otpSignup", { session, data });
                });
              }
            });
          }
        }
      );
    } else {
      res.render("user/userSignup", {
        session,
        err_message: "password must be same",
      });
    }
  },
  otpSignup: async (req, res) => {
    console.log(req.body);
    const data = req.body;
    const verify = await otpsign.find({ otp: data.otp });
    if (verify) {
      await otpsign.deleteOne({_id:verify[0]._id});
      console.log(verify);
      let password = await bcrypt.hash(data.password, 10);
      const newUser = new User({
        username: data.username,
        email: data.email,
        mobile: data.mobile,
        password: password,
      });
      newUser.save().then(() => {
        res.redirect("/user");
      });
    } else {
      res.render("user/otpSignup", {
        session,
        data,
        err_message: "invalid otp",
      });
    }
  },
  viewProduct: async (req, res) => {
    const id = req.params.id;
    await products.find({ _id: id }).then((data) => {
      res.render("user/productView", { session, data });
    });
  },
};

