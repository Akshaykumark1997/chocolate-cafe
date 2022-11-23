const router = require('express').Router();
 const adminLogin = require('../controllers/adminController');

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
// router.get('/addproducts',adminLogin.addProducts);
router.route('/addProducts').get(adminLogin.addProducts).post(adminLogin.postProducts);
router.get('/userDetails',adminLogin.userDetails);
router.get('/blockuser/:id',verifyLogin,adminLogin.blockuser);
router.get("/unblockuser/:id", verifyLogin, adminLogin.unblockuser);
module.exports = router;