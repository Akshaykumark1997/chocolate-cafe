const router = require("express").Router();
const adminLogin = require("../controllers/adminController");
const verifyLogin = require("../middleware/Session");

//admin login, dashboard and logout
router.get("/", adminLogin.getlogin);
router.post("/adminLogin", adminLogin.postLogin);
router.get("/logout", adminLogin.getLogout);
router.get("/adminhome", verifyLogin.verifyLoginAdmin, adminLogin.gethome);

//products list , add, edit and delete products
router.get("/products", verifyLogin.verifyLoginAdmin, adminLogin.products);
router
  .route("/addProducts")
  .get(verifyLogin.verifyLoginAdmin, adminLogin.addProducts)
  .post(verifyLogin.verifyLoginAdmin, adminLogin.postProducts);
router
  .route("/editProduct/:id")
  .get(verifyLogin.verifyLoginAdmin, adminLogin.editProduct)
  .post(verifyLogin.verifyLoginAdmin, adminLogin.postEditProduct);
router.get(
  "/deleteProduct/:id",
  verifyLogin.verifyLoginAdmin,
  adminLogin.deleteProduct
);

//userlist ,block and unblock user
router.get(
  "/userDetails",
  verifyLogin.verifyLoginAdmin,
  adminLogin.userDetails
);
router.get(
  "/blockuser/:id",
  verifyLogin.verifyLoginAdmin,
  adminLogin.blockuser
);
router.get(
  "/unblockuser/:id",
  verifyLogin.verifyLoginAdmin,
  adminLogin.unblockuser
);

//category list , add, edit and delete category
router.get("/categories", verifyLogin.verifyLoginAdmin, adminLogin.categories);
router.post(
  "/addCategory",
  verifyLogin.verifyLoginAdmin,
  adminLogin.addCategory
);
router.post(
  "/editCategory/:id",
  verifyLogin.verifyLoginAdmin,
  adminLogin.editCategory
);
router.get(
  "/deleteCategory/:id",
  verifyLogin.verifyLoginAdmin,
  adminLogin.deleteCategory
);

//order list and change order status
router.get("/orders", verifyLogin.verifyLoginAdmin, adminLogin.orders);
router.post(
  "/changeStatus/:id",
  verifyLogin.verifyLoginAdmin,
  adminLogin.changeStatus
);

//coupons , add and edit coupons
router.get("/coupons", verifyLogin.verifyLoginAdmin, adminLogin.getCoupons);
router.post("/addCoupon", verifyLogin.verifyLoginAdmin, adminLogin.addCoupon);
router.post(
  "/editCoupon/:id",
  verifyLogin.verifyLoginAdmin,
  adminLogin.editCoupon
);

//sales reports , daily report ,monthly report and total report
router.get(
  "/salesReports",
  verifyLogin.verifyLoginAdmin,
  adminLogin.salesReports
);
router.get(
  "/dailyReport",
  verifyLogin.verifyLoginAdmin,
  adminLogin.dailyReports
);
router.get(
  "/monthlyReport",
  verifyLogin.verifyLoginAdmin,
  adminLogin.monthlyReports
);

//banner ,add ,edit and delete banner
router.get("/banner", verifyLogin.verifyLoginAdmin, adminLogin.banner);
router
  .route("/addBanner")
  .get(verifyLogin.verifyLoginAdmin, adminLogin.addBanner)
  .post(verifyLogin.verifyLoginAdmin, adminLogin.postAddBanner);
router
  .route("/editBanner/:id")
  .get(verifyLogin.verifyLoginAdmin, adminLogin.editBanner)
  .post(verifyLogin.verifyLoginAdmin, adminLogin.postEditBanner);
router.get(
  "/deleteBanner/:id",
  verifyLogin.verifyLoginAdmin,
  adminLogin.deleteBanner
);
module.exports = router;
