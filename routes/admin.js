const router = require("express").Router();
const adminLogin = require("../controllers/adminController");
const verifyLogin = require("../middleware/Session");

router.get("/", adminLogin.getlogin);
router.post("/adminLogin", adminLogin.postLogin);
router.get("/logout", adminLogin.getLogout);
router.get("/adminhome", verifyLogin.verifyLoginAdmin, adminLogin.gethome);
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
module.exports = router;
