const User = require("../../model/userSignUp");
const bcrypt = require("bcrypt");

module.exports = {
  getLogin: (req, res) => {
    res.render("user/user_login");
  },
  getSignup: (req, res) => {
    res.render("user/user_signup");
  },
  postSignup: async (req, res) => {
    if (req.body.password === req.body.confirmpassword) {
      let name = req.body.username;
      let emailid = req.body.email;
      let password = await bcrypt.hash(req.body.password, 10);
      User.find({ username: name, email: emailid }).then((result) => {
        if (result.length) {
          res.render("user/user_signup", {
            err_message: "email or username already exists",
          });
        } else {
          const user = new User({
            username: name,
            email: emailid,
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
      res.render("user/user_signup", {
        err_message: "password must be same",
      });
    }
  },
};
