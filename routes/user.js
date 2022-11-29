const express = require("express");
const router = express.Router();
const userLogin = require("../controllers/userController");
const verifyLogin = require("../middleware/Session");

router.get("/", userLogin.guestHome);
router.get("/user", userLogin.getLogin);
router.get("/userhome", userLogin.gethome);
router.post("/login", userLogin.postLogin);
router.get("/logout", userLogin.userLogout);
router.route("/signup").get(userLogin.getSignup).post(userLogin.postSignup);
router.post("/otpsignup", userLogin.otpSignup);
router.get("/viewProduct/:id", userLogin.viewProduct);
router.get("/cart", verifyLogin.verifyLoginUser, userLogin.viewCart);
router.get("/addCart/:id", verifyLogin.verifyLoginUser, userLogin.addCart);
router.post(
  "/changeQuantity",
  verifyLogin.verifyLoginUser,
  userLogin.changeQuantity
);
router.post(
  "/removeProduct",
  verifyLogin.verifyLoginUser,
  userLogin.removeProduct
);
router.get("/totalAmount", verifyLogin.verifyLoginUser, userLogin.totalAmount);
router.get("/checkout", verifyLogin.verifyLoginUser, userLogin.checkout);
router.get("/account", verifyLogin.verifyLoginUser, userLogin.account);
router
  .route("/editAccount")
  .get(verifyLogin.verifyLoginUser, userLogin.editAccount)
  .post(verifyLogin.verifyLoginUser, userLogin.postEditAccount);
module.exports = router;
