const User = require("../../model/userSignUp");
const bcrypt = require("bcrypt");
const user = require("../../model/userSignUp");
let session;
module.exports = {
  getLogin: (req, res) => {
     session = req.session.userId;
    if (session) {
      res.redirect("/userhome");
    } else {
      res.render("user/userLogin",{session});
    }
  },
  gethome: (req, res) => {
    session = req.session.userId;
    if (session) {
      res.render("user/products",{session});
    } else {
      res.redirect("/");
    }
  },
  postLogin: async (req, res) => {
    let email = req.body.email;
    console.log(email);
    const userDetails = await user.find({ email: email });
    console.log(userDetails);
    if (userDetails.length) {
      const value = await bcrypt.compare(
        req.body.password,
        userDetails[0].password
      );
      if (value) {
        req.session.userId = req.body.email;
        res.redirect("/userhome");
      } else {
        res.render("user/userLogin", {
          err_message: "email or password incorrect",
        });
      }
    } else {
      res.render("user/userLogin", {
        err_message: "email not registered",
      });
    }
  },
  userLogout:(req,res)=>{
    req.session.destroy();
    res.redirect('/');
  },
  getSignup: (req, res) => {
    res.render("user/userSignup",{session});
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
              res.redirect("/");
            })
            .catch(() => {
              res.redirect("/signup");
            });
        }
      }); 
    } else {
      res.render("user/userSignup", {
        err_message: "password must be same",
      });
    }
  },
};
