const express = require("express");
const router = express.Router();
const userLogin = require("../controllers/userController");
const verifyLogin = require("../middleware/Session");

//guest home and user homepage
router.get("/", userLogin.guestHome);
router.get("/user", userLogin.getLogin);
router.get("/userhome", userLogin.gethome);

//category list in user shop page and user shop page
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

//user login ,signup ,otp and logout
router.post("/login", userLogin.postLogin);
router.get("/logout", userLogin.userLogout);
router.route("/signup").get(userLogin.getSignup).post(userLogin.postSignup);
router.post("/otpsignup", userLogin.otpSignup);

//product view page
router.get("/viewProduct/:id", userLogin.viewProduct);

//wishlist , add to wishlist and remove wishlist
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

//cart ,add to cart ,change quantity and remove product from cart
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

//checkout page
router.get("/checkout", verifyLogin.verifyLoginUser, userLogin.viewCheckout);

//user profile page
router.get("/account", verifyLogin.verifyLoginUser, userLogin.account);

//user profile edit and change password
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

//placeorder and verify payment through razor pay
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

//order details and order product details on user side
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

//order cancel
router.get(
  "/cancelOrder/:id",
  verifyLogin.verifyLoginUser,
  userLogin.cancelOrder
);
//about page
router.get("/about", userLogin.about);
module.exports = router;
