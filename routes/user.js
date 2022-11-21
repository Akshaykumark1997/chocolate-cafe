const express = require("express");
const router = express.Router();
const userLogin = require("../controllers/userController/userController");

router.get('/',userLogin.getLogin);
// router.get('/signup',userLogin.signup);
// router.post('/signup',userLogin.signup);
router.get('/login',userLogin.postLogin);
router.route('/signup').get(userLogin.getSignup).post(userLogin.postSignup);
router.get('/products',(req,res)=>{
    res.render('user/products');
})
module.exports = router;
