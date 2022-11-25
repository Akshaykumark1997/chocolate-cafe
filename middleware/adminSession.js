module.exports = {
verifyLogin: (req, res, next) => {
  if (req.session.adminId) {
    next();
  } else {
    res.redirect("/admin");
  }
}
}





