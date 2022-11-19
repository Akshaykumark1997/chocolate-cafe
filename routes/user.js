const express = require("express");
const router = express.Router();
const userLogin = require("../controllers/userController/userController");

router.get('/',userLogin.getLogin);
// router.get('/signup',userLogin.signup);
// router.post('/signup',userLogin.signup);
router.route('/signup').get(userLogin.getSignup).post(userLogin.postSignup);
module.exports = router;
