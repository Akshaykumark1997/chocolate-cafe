const products = require("../model/product");
const user = require("../model/userSignUp");
const category = require("../model/categories");
const order = require("../model/order");
const cart = require("../model/cart");
const path = require("path");
const mongoose = require("mongoose");
const moment = require("moment");
moment().format();
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
  gethome: async (req, res) => {
    try {
      let session = req.session;
      if (session.adminId) {
        const orderData = await order.find();
        // console.log(orderData);
        const totalAmount = orderData.reduce((accumulator, object) => {
          return (accumulator += object.totalAmount);
        }, 0);
        // console.log(totalAmount);
        const OrderToday = await order.find({
          orderDate: moment().format("MMM Do YY"),
        });
        // console.log(OrderToday);
        const totalOrderToday = OrderToday.reduce((accumulator, object) => {
          return (accumulator += object.totalAmount);
        }, 0);
        const allOrders = orderData.length;
        const pendingOrder = await order.find({ orderStatus: "pending" });
        const pending = pendingOrder.length;
        const processingOrder = await order.find({ orderStatus: "shipped" });
        const processing = processingOrder.length;
        const deliveredOrder = await order.find({ orderStatus: "delivered" });
        const delivered = deliveredOrder.length;
        const cancelledOrder = await order.find({ orderStatus: "cancelled" });
        const cancelled = cancelledOrder.length;
        const cod = await order.find({ paymentMethod: "COD" });
        const codOrder = cod.length;
        const razorPay = await order.find({
          paymentMethod: "Online",
        });
        const razorPayOrder = razorPay.length;
        const activeUsers = await user.find({ isBlocked: false }).count();
        const product = await products.find({isDeleted:false}).count()
        const allOrderDetails = await order.find({paymentStatus:"paid",orderStatus:"delivered"});
        console.log(allOrderDetails);
        // const start =  moment().startOf("month").format("MMM Do YY");
        // const end =  moment().endOf("month").format("MMM Do YY");
        // const amountPendingList = await order.find({
        //   orderDate: {
        //     $gte: end,
        //     $lte:start,
        //   },
        // });
        //  console.log(amountPendingList);
        // const amountPending = amountPendingList.reduce((accumulator,object)=>{
        //   return accumulator+= object.totalAmount;
        // },0)
        res.render("admin/adminDashboard", {
          totalAmount,
          totalOrderToday,
          allOrders,
          pending,
          processing,
          delivered,
          cancelled,
          codOrder,
          razorPayOrder,
          activeUsers,
          product,
          allOrderDetails,
        });
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
              { $pull: { product: { productId: objId } } },
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
  addCategory: async (req, res) => {
    try {
      const categoryData = req.body.category;
      const allCategories = await category.find();
      const verify = category.findOne({ category: categoryData });
      if (verify.length) {
        const newCategory = new category({
          category: categoryData,
        });
        newCategory.save().then(() => {
          res.redirect("/admin/categories");
        });
      } else {
        res.render("admin/categories", {
          err_message: "category already exists",
          allCategories,
        });
      }
    } catch {
      console.error();
    }
  },
  editCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const categoryData = await category.findOne({ _id: id });
      console.log(categoryData);
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
          products
            .updateMany(
              { category: categoryData.category },
              { $set: { category: req.body.category } }
            )
            .then((data) => {
              console.log(data);
            });
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
    order
      .aggregate([
        {
          $lookup: {
            from: "productdetails",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "products",
          },
        },
        {
          $lookup: {
            from: "userdetails",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
      ])
      .then((orderDetails) => {
        res.render("admin/orders", { orderDetails });
      });
  },
  changeStatus: (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    const data = req.body;
    console.log(data);
    order
      .updateOne(
        { _id: id },
        {
          $set: {
            orderStatus: data.orderStatus,
            paymentStatus: data.paymentStatus,
          },
        }
      )
      .then((data) => {
        console.log(data);
        res.redirect("/admin/orders");
      });
  },
};
