const express = require("express");
const router = express.Router();
const userLogin = require("../controllers/userController/userController");

router.get('/',userLogin.getLogin);
router.get('/signup',userLogin.signup);
module.exports = router;
