const products = require("../model/product");
const user = require("../model/userSignUp");
const category = require("../model/categories");
const order = require("../model/order");
const cart = require("../model/cart");
const coupon = require("../model/coupon.js");
const path = require("path");
const mongoose = require("mongoose");
const banner = require("../model/banner");
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
        const orderData = await order.find({
          orderStatus: { $ne: "Cancelled" },
        });

        const totalAmount = orderData.reduce((accumulator, object) => {
          return (accumulator += object.totalAmount);
        }, 0);

        const OrderToday = await order.find({
          orderStatus: { $ne: "Cancelled" },
          orderDate: moment().format("MMM Do YY"),
        });

        const totalOrderToday = OrderToday.reduce((accumulator, object) => {
          return (accumulator += object.totalAmount);
        }, 0);
        const allOrders = orderData.length;
        const pendingOrder = await order.find({ orderStatus: "Pending" });
        const pending = pendingOrder.length;
        const processingOrder = await order.find({ orderStatus: "Shipped" });
        const processing = processingOrder.length;
        const deliveredOrder = await order.find({ orderStatus: "Delivered" });
        const delivered = deliveredOrder.length;
        const cancelledOrder = await order.find({ orderStatus: "Cancelled" });
        const cancelled = cancelledOrder.length;
        const cod = await order.find({ paymentMethod: "COD" });
        const codOrder = cod.length;
        const razorPay = await order.find({
          paymentMethod: "Online",
        });
        const razorPayOrder = razorPay.length;
        const activeUsers = await user.find({ isBlocked: false }).count();
        const product = await products.find({ isDeleted: false }).count();
        const allOrderDetails = await order.find({
          paymentStatus: "Paid",
          orderStatus: "Delivered",
        });
        const start = moment().startOf("month");
        const end = moment().endOf("month");
        const amountPendingList = await order.find({
          orderStatus: { $ne: "Cancelled" },
          createdAt: {
            $gte: start,
            $lte: end,
          },
        });

        const amountPending = amountPendingList.reduce(
          (accumulator, object) => {
            return (accumulator += object.totalAmount);
          },
          0
        );
        res.render("admin/adminDashboard", {
          totalAmount:Math.ceil(totalAmount),
          totalOrderToday:Math.ceil(totalOrderToday),
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
          amountPending:Math.ceil(amountPending),
        });
      } else {
        res.redirect("/admin");
      }
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  getLogout: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/admin");
    } catch {
      console.error();
      res.render("user/error");
    }
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
      res.render("user/error");
    }
  },
  addProducts: (req, res) => {
    try {
      category.find().then((categories) => {
        res.render("admin/addproducts", { categories });
      });
    } catch {
      console.error();
      res.render("user/error");
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
        res.render("user/error");
      }
    } catch {
      console.error();
      res.render("user/error");
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
      res.render("user/error");
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
      res.render("user/error");
    }
  },
  deleteProduct: (req, res) => {
    try {
      const id = req.params.id;
      const objId = mongoose.Types.ObjectId(id);
      products
        .updateOne({ _id: id }, { $set: { isDeleted: true } })
        .then(() => {
          cart
            .updateMany(
              { "product.productId": objId },
              { $pull: { product: { productId: objId } } },
              { multi: true }
            )
            .then(() => {
              res.redirect("/admin/products");
            });
        });
    } catch {
      console.error();
      res.render("user/error");
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
      res.render("user/error");
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
      res.render("user/error");
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
      res.render("user/error");
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
      res.render("user/error");
    }
  },
  addCategory: async (req, res) => {
    try {
      const categoryData = req.body.category;
      const allCategories = await category.find();
      const verify = await category.findOne({ category: categoryData });
      if (verify == null) {
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
      res.render("user/error");
    }
  },
  editCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const categoryData = await category.findOne({ _id: id });
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
            .then(() => {
              res.redirect("/admin/categories");
            });
        });
    } catch {
      console.error();
      res.render("user/error");
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
      res.render("user/error");
    }
  },
  orders: async (req, res) => {
    try {
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
          { $sort: { orderDate: -1 } },
        ])
        .then((orderDetails) => {
          res.render("admin/orders", { orderDetails });
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  changeStatus: async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const orderDetails = await order.findOne({ _id: id });
      const objId = mongoose.Types.ObjectId(id);
      const orderData = await order.aggregate([
        {
          $match: { _id: objId },
        },
        {
          $unwind: "$orderItems",
        },
        {
          $lookup: {
            from: "productdetails",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "products",
          },
        },
        {
          $project: {
            quantity: "$orderItems.quantity",
            products: { $arrayElemAt: ["$products", 0] },
          },
        },
      ]);
      if (data.orderStatus == "Cancelled") {
        for (let i = 0; i < orderData.length; i++) {
          const updatedStock =
            orderData[i].products.stock + orderData[i].quantity;
          products
            .updateOne(
              {
                _id: orderData[i].products._id,
              },
              {
                stock: updatedStock,
              }
            )
            .then((data) => {
              console.log(data);
            });
        }
      } else if (orderDetails.orderStatus == "Cancelled") {
        for (let i = 0; i < orderData.length; i++) {
          const updatedStock =
            orderData[i].products.stock - orderData[i].quantity;
          products
            .updateOne(
              {
                _id: orderData[i].products._id,
              },
              {
                stock: updatedStock,
              }
            )
            .then((data) => {
              console.log(data);
            });
        }
      }
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
        .then(() => {
          res.redirect("/admin/orders");
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  getCoupons: (req, res) => {
    try {
      coupon.find().then((coupons) => {
        res.render("admin/coupons", { coupons });
      });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  addCoupon: (req, res) => {
    try {
      const data = req.body;
      const dis = parseInt(data.discount);
      const max = parseInt(data.max);
      const discount = dis / 100;

      coupon
        .create({
          couponName: data.coupon,
          discount: discount,
          maxLimit: max,
          expirationTime: data.exdate,
        })
        .then(() => {
          res.redirect("/admin/coupons");
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  editCoupon: (req, res) => {
    try{
    const id = req.params.id;
    const data = req.body;
    coupon
      .updateOne(
        { _id: id },
        {
          couponName: data.coupon,
          discount: data.discoun,
          maxLimit: data.max,
          expirationTime: data.exdate,
        }
      )
      .then(() => {
        res.redirect("/admin/coupons");
      });
    }catch{
      console.error();
      res.render('user/error');
    }
  },
  salesReports: async (req, res) => {
    try {
      const allOrderDetails = await order.find({
        paymentStatus: "Paid",
        orderStatus: "Delivered",
      });
      res.render("admin/salesReports", { allOrderDetails });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  dailyReports: (req, res) => {
    try {
      order
        .find({
          $and: [
            { paymentStatus: "Paid", orderStatus: "Delivered" },
            {
              orderDate: moment().format("MMM Do YY"),
            },
          ],
        })
        .then((allOrderDetails) => {
          res.render("admin/salesReports", { allOrderDetails });
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  monthlyReports: (req, res) => {
    try {
      const start = moment().startOf("month");
      const end = moment().endOf("month");
      order
        .find({
          $and: [
            { paymentStatus: "Paid", orderStatus: "Delivered" },
            {
              createdAt: {
                $gte: start,
                $lte: end,
              },
            },
          ],
        })
        .then((allOrderDetails) => {
          res.render("admin/salesReports", { allOrderDetails });
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  banner: (req, res) => {
    try {
      banner.find().then((banners) => {
        res.render("admin/viewBanner", { banners });
      });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  addBanner: (req, res) => {
    try {
      coupon.find().then((coupons) => {
        res.render("admin/addBanner", { coupons });
      });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  postAddBanner: (req, res) => {
    try {
      const data = req.body;
      const image = req.files.image;
      banner
        .create({
          banner: data.banner,
          bannerText: data.bannertext,
          couponName: data.couponName,
        })
        .then((bannerData) => {
          let imagename = bannerData._id;
          image.mv(
            path.join(__dirname, "../public/admin/banners/") +
              imagename +
              ".jpg",
            (err) => {
              if (!err) {
                res.redirect("/admin/banner");
              } else {
                console.log(err);
              }
            }
          );
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  editBanner: (req, res) => {
    try {
      const id = req.params.id;
      banner.find({ _id: id }).then((banners) => {
        coupon.find().then((coupons) => {
          res.render("admin/editBanner", { banners, coupons });
        });
      });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  postEditBanner: (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      banner
        .updateOne(
          { _id: id },
          {
            banner: data.banner,
            bannerText: data.bannertext,
            couponName: data.couponName,
          }
        )
        .then(() => {
          if (req?.files?.image) {
            const image = req.files.image;
            image.mv(
              path.join(__dirname, "../public/admin/banners/") + id + ".jpg"
            );
            res.redirect("/admin/banner");
          } else {
            res.redirect("/admin/banner");
          }
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
  deleteBanner: (req, res) => {
    try {
      const id = req.params.id;
      banner
        .updateOne(
          { _id: id },
          {
            $set: {
              isDeleted: true,
            },
          }
        )
        .then(() => {
          res.redirect("/admin/banner");
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  },
};
