const router = require("express").Router();
const adminLogin = require("../controllers/adminController");
const verifyLogin = require('../middleware/adminSession');



router.get("/", adminLogin.getlogin);
router.post("/adminLogin", adminLogin.postLogin);
router.get("/logout", adminLogin.getLogout);
router.get("/adminhome",verifyLogin.verifyLogin, adminLogin.gethome);
router.get("/products",verifyLogin.verifyLogin, adminLogin.products);
router
  .route("/addProducts")
  .get(verifyLogin.verifyLogin, adminLogin.addProducts)
  .post(verifyLogin.verifyLogin, adminLogin.postProducts);
router
  .route("/editProduct/:id")
  .get(verifyLogin.verifyLogin, adminLogin.editProduct)
  .post(verifyLogin.verifyLogin, adminLogin.postEditProduct);
router.get("/deleteProduct/:id", verifyLogin.verifyLogin, adminLogin.deleteProduct);
router.get("/userDetails",verifyLogin.verifyLogin, adminLogin.userDetails);
router.get("/blockuser/:id", verifyLogin.verifyLogin, adminLogin.blockuser);
router.get("/unblockuser/:id", verifyLogin.verifyLogin, adminLogin.unblockuser);
router.get("/categories", verifyLogin.verifyLogin, adminLogin.categories);
router.post("/addCategory", verifyLogin.verifyLogin, adminLogin.addCategory);
router.post("/editCategory/:id", verifyLogin.verifyLogin, adminLogin.editCategory);
router.get("/deleteCategory/:id", verifyLogin.verifyLogin, adminLogin.deleteCategory);
module.exports = router;
