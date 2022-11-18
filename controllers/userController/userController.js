module.exports = {
  getLogin: (req, res) => {
    res.render("user/user_login");
  },
  signup:(req,res)=>{
    res.render('user/user_signup');
  }
};
