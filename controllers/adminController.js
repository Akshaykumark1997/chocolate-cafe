const products = require("../model/product");
const user = require("../model/userSignUp");
const category = require("../model/categories");
const order = require("../model/order");
const cart = require("../model/cart");
const path = require("path");
const mongoose = require("mongoose");

const adminDetails = {
  email: "admin@gmail.com",
  password: "admin@123",
};

module.exports = {
  getlogin: (req, res) => {
    try {
      let session = req.session;
      if (session.adminId) {
        res.redirect("/admin/adminhome");
      } else {
        res.render("admin/adminLogin");
      }
    } catch {
      console.error();
    }
  },
  postLogin: (req, res) => {
    try {
      if (
        req.body.email === adminDetails.email &&
        req.body.password === adminDetails.password
      ) {
        req.session.adminId = req.body.email;
        res.redirect("/admin/adminhome");
      } else {
        res.render("admin/adminLogin", {
          err_message: "username or password incorrect",
        });
      }
    } catch {
      console.error();
    }
  },
  gethome: (req, res) => {
    try {
      let session = req.session;
      if (session.adminId) {
        res.render("admin/adminDashboard");
      } else {
        res.redirect("/admin");
      }
    } catch {
      console.error();
    }
  },
  getLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin");
  },
  products: async (req, res) => {
    try {
      if (req.session.adminId) {
        const allproducts = await products.find();
        res.render("admin/productsDetails", { allproducts });
      } else {
        res.redirect("/admin");
      }
    } catch {
      console.error();
    }
  },
  addProducts: (req, res) => {
    try {
      category.find().then((categories) => {
        res.render("admin/addproducts", { categories });
      });
    } catch {
      console.error();
    }
  },
  postProducts: async (req, res) => {
    try {
      const image = req.files.image;
      const newProduct = new products({
        product: req.body.product,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        stock: req.body.stock,
      });
      const productData = await newProduct.save();
      if (productData) {
        let imagename = productData._id;
        image.mv(
          path.join(__dirname, "../public/admin/products/") +
            imagename +
            ".jpg",
          (err) => {
            if (!err) {
              res.redirect("/admin/products");
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.error();
      }
    } catch {
      console.error();
    }
  },
  editProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const categories = await category.find();
      const productData = await products.findOne({ _id: id });
      if (productData) {
        res.render("admin/editProduct", { productData, categories });
      } else {
        res.redirect("/admin/products");
      }
    } catch {
      console.error();
    }
  },
  postEditProduct: async (req, res) => {
    try {
      const id = req.params.id;
      await products.updateOne(
        { _id: id },
        {
          $set: {
            product: req.body.product,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            stock: req.body.stock,
          },
        }
      );
      if (req?.files?.image) {
        const image = req.files.image;
        image.mv(
          path.join(__dirname, "../public/admin/products/") + id + ".jpg"
        );
        res.redirect("/admin/products");
      } else {
        res.redirect("/admin/products");
      }
    } catch {
      console.error();
    }
  },
  deleteProduct: (req, res) => {
    try {
      const id = req.params.id;
      const objId = mongoose.Types.ObjectId(id);
      console.log(objId);
      products
        .updateOne({ _id: id }, { $set: { isDeleted: true } })
        .then(() => {
          cart
            .updateMany(
              { "product.productId": objId },
              {   $pull: { product: { productId: objId } } } ,
              { multi: true }
            )
            .then((data) => {
              console.log(data);
              res.redirect("/admin/products");
            });
        });
    } catch {
      console.error();
    }
  },
  userDetails: async (req, res) => {
    try {
      if (req.session.adminId) {
        const allusers = await user.find();
        res.render("admin/userDetails", { allusers });
      } else {
        res.redirect("/admin");
      }
    } catch {
      console.error();
    }
  },

  blockuser: (req, res) => {
    try {
      const id = req.params.id;
      user.updateOne({ _id: id }, { $set: { isBlocked: true } }).then(() => {
        res.redirect("/admin/userDetails");
      });
    } catch {
      console.error();
    }
  },
  unblockuser: (req, res) => {
    try {
      const id = req.params.id;
      user.updateOne({ _id: id }, { $set: { isBlocked: false } }).then(() => {
        res.redirect("/admin/userDetails");
      });
    } catch {
      console.error();
    }
  },
  categories: async (req, res) => {
    try {
      const allCategories = await category.find();
      if (allCategories) {
        res.render("admin/categories", { allCategories });
      }
    } catch {
      console.error();
    }
  },
  addCategory: (req, res) => {
    try {
      const categoryData = req.body.category;
      const newCategory = new category({
        category: categoryData,
      });
      newCategory.save().then(() => {
        res.redirect("/admin/categories");
      });
    } catch {
      console.error();
    }
  },
  editCategory: (req, res) => {
    try {
      const id = req.params.id;
      category
        .updateOne(
          { _id: id },
          {
            $set: {
              category: req.body.category,
            },
          }
        )
        .then(() => {
          res.redirect("/admin/categories");
        });
    } catch {
      console.error();
    }
  },
  deleteCategory: (req, res) => {
    try {
      const id = req.params.id;
      category.deleteOne({ _id: id }).then(() => {
        res.redirect("/admin/categories");
      });
    } catch {
      console.error();
    }
  },
  orders: async (req, res) => {
    const orderDetails = await order.find();
    res.render("admin/orders", { orderDetails });
  },
};
