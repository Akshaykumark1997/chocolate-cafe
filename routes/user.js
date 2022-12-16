const express = require("express");
const router = express.Router();
const userLogin = require("../controllers/userController");
const verifyLogin = require("../middleware/Session");

router.get("/", userLogin.guestHome);
router.get("/user", userLogin.getLogin);
router.get("/userhome", userLogin.gethome);
router.get(
  "/chocolate/:id",

  userLogin.getCategory
);
router.get("/shop", verifyLogin.verifyLoginUser, userLogin.shop);
router.get(
  "/categoryShop/:id",
  verifyLogin.verifyLoginUser,
  userLogin.shopCategory
);
router.post("/login", userLogin.postLogin);
router.get("/logout", userLogin.userLogout);
router.route("/signup").get(userLogin.getSignup).post(userLogin.postSignup);
router.post("/otpsignup", userLogin.otpSignup);
router.get("/viewProduct/:id", userLogin.viewProduct);
router.get("/wishlist", verifyLogin.verifyLoginUser, userLogin.wishlist);
router.get(
  "/addToWishlist/:id",
  verifyLogin.verifyLoginUser,
  userLogin.addToWishlist
);
router.post(
  "/removewishlistProduct",
  verifyLogin.verifyLoginUser,
  userLogin.removewishlistProduct
);
router.get("/cart", verifyLogin.verifyLoginUser, userLogin.viewCart);
router.get("/addCart/:id", verifyLogin.verifyLoginUser, userLogin.addCart);
router.post(
  "/changeQuantity",
  verifyLogin.verifyLoginUser,
  userLogin.changeQuantity,
  userLogin.totalAmount
);
router.post(
  "/removeProduct",
  verifyLogin.verifyLoginUser,
  userLogin.removeProduct
);
router.get("/checkout", verifyLogin.verifyLoginUser, userLogin.viewCheckout);
router.get("/account", verifyLogin.verifyLoginUser, userLogin.account);
router
  .route("/editAccount")
  .get(verifyLogin.verifyLoginUser, userLogin.editAccount)
  .post(verifyLogin.verifyLoginUser, userLogin.postEditAccount);
router.get(
  "/changePassword/:id",
  verifyLogin.verifyLoginUser,
  userLogin.changePassword
);
router.post(
  "/newPassword",
  verifyLogin.verifyLoginUser,
  userLogin.postChangePassword
);

router.post("/placeOrder", verifyLogin.verifyLoginUser, userLogin.placeOrder);
router.post(
  "/verifyPayment",
  verifyLogin.verifyLoginUser,
  userLogin.verifyPayment
);
router.get(
  "/paymentFail",
  verifyLogin.verifyLoginUser,
  userLogin.paymentFailure
);
router.get(
  "/orderSuccess",
  verifyLogin.verifyLoginUser,
  userLogin.orderSuccess
);
router.get(
  "/orderDetails",
  verifyLogin.verifyLoginUser,
  userLogin.orderDetails
);
router.get(
  "/viewOrderProducts/:id",
  verifyLogin.verifyLoginUser,
  userLogin.viewOrderProducts
);
router.get(
  "/cancelOrder/:id",
  verifyLogin.verifyLoginUser,
  userLogin.cancelOrder
);
// router.get('/about', userLogin.about);
module.exports = router;
