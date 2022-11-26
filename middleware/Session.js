module.exports = {
verifyLoginAdmin: (req, res, next) => {
  if (req.session.adminId) {
    next();
  } else {
    res.redirect("/admin");
  }
},
verifyLoginUser:(req,res,next)=>{
  if(req.session.userId){
    next();
  }else{
    res.redirect('/user');
  }
}
}





