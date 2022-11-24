const User = require("../model/userSignUp");
const products = require("../model/product");
const bcrypt = require("bcrypt");
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
  userLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/user");
  },
  getSignup: (req, res) => {
    res.render("user/userSignup", { session });
  },
  postSignup: async (req, res) => {
    if (req.body.password === req.body.confirmpassword) {
      let name = req.body.username;
      let emailid = req.body.email;
      let mobile = req.body.mobile;
      let password = await bcrypt.hash(req.body.password, 10);
      User.find({ username: name, email: emailid }).then((result) => {
        if (result.length) {
          res.render("user/userSignup", {
            session,
            err_message: "email or username already exists",
          });
        } else {
          const user = new User({
            username: name,
            email: emailid,
            mobile: mobile,
            password: password,
          });
          user
            .save()
            .then(() => {
              res.redirect("/user");
            })
            .catch(() => {
              res.redirect("/signup");
            });
        }
      });
    } else {
      res.render("user/userSignup", {
        session,
        err_message: "password must be same",
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
