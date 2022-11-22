const express = require("express");
const router = express.Router();
const userLogin = require("../controllers/userController/userController");

router.get('/',userLogin.getLogin);
router.get('/userhome',userLogin.gethome);
router.post('/login',userLogin.postLogin);
router.get('/logout',userLogin.userLogout);
router.route('/signup').get(userLogin.getSignup).post(userLogin.postSignup);
router.get('/products',(req,res)=>{
    res.render('user/products');
})
module.exports = router;
// router.get('/signup',userLogin.signup);
// router.post('/signup',userLogin.signup);