const router = require("express").Router();
const adminLogin = require("../controllers/adminController");

const verifyLogin = (req, res, next) => {
  if (req.session.adminId) {
    next();
  } else {
    res.redirect("/admin");
  }
};

router.get("/", adminLogin.getlogin);
router.post("/adminLogin", adminLogin.postLogin);
router.get("/logout", adminLogin.getLogout);
router.get("/adminhome", adminLogin.gethome);
router.get("/products", adminLogin.products);
router
  .route("/addProducts")
  .get(verifyLogin, adminLogin.addProducts)
  .post(verifyLogin, adminLogin.postProducts);
router
  .route("/editProduct/:id")
  .get(verifyLogin, adminLogin.editProduct)
  .post(verifyLogin, adminLogin.postEditProduct);
router.get("/deleteProduct/:id", verifyLogin, adminLogin.deleteProduct);
router.get("/userDetails", adminLogin.userDetails);
router.get("/blockuser/:id", verifyLogin, adminLogin.blockuser);
router.get("/unblockuser/:id", verifyLogin, adminLogin.unblockuser);
router.get("/categories", verifyLogin, adminLogin.categories);
router.post("/addCategory", verifyLogin, adminLogin.addCategory);
router.post("/editCategory/:id", verifyLogin, adminLogin.editCategory);
router.get("/deleteCategory/:id", verifyLogin, adminLogin.deleteCategory);
module.exports = router;
