const router = require('express').Router();
 const adminLogin = require('../controllers/adminController/adminController');

const verifyLogin = (req, res, next) => {
  if (req.session.adminId) {
    next();
  } else {
    res.redirect("/admin");
  }
};

router.get('/',adminLogin.getlogin);
router.post('/adminLogin',adminLogin.postLogin);
router.get('/logout',adminLogin.getLogout);
router.get('/adminhome',adminLogin.gethome);
router.get('/products',adminLogin.products);
router.get('/addproducts',adminLogin.addProducts);
router.get('/userDetails',adminLogin.userDetails);
router.get('/deleteuser/:id',verifyLogin,adminLogin.deleteuser);
module.exports = router;