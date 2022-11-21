const User = require("../../model/userSignUp");
const bcrypt = require("bcrypt");

module.exports = {
  getLogin: (req, res) => {
    res.render("user/userLogin");
  },
  postLogin:async(req,res)=>{

  },
  getSignup: (req, res) => {
    res.render("user/userSignup");
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
            mobile:mobile,
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
