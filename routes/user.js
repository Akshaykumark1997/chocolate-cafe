const express = require("express");
const router = express.Router();
const userLogin = require("../controllers/userController");

router.get("/", userLogin.guestHome);
router.get("/user", userLogin.getLogin);
router.get("/userhome", userLogin.gethome);
router.post("/login", userLogin.postLogin);
router.get("/logout", userLogin.userLogout);
router.route("/signup").get(userLogin.getSignup).post(userLogin.postSignup);
router.post('/otpsignup',userLogin.otpSignup);
router.get("/viewProduct/:id", userLogin.viewProduct);
module.exports = router;
// router.get('/signup',userLogin.signup);
// router.post('/signup',userLogin.signup);
