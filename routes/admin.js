const router = require('express').Router();
 const adminLogin = require('../controllers/adminController/adminController');

router.get('/',adminLogin.getlogin);
router.post('/adminLogin',adminLogin.postLogin);
router.get('/adminhome',adminLogin.gethome);
router.get('/products',adminLogin.products);
router.get('/addproducts',adminLogin.addProducts);
router.get('/userDetails',adminLogin.userDetails);

module.exports = router;