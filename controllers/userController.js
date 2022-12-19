const User = require("../model/userSignUp");
const products = require("../model/product");
const otpsign = require("../model/otp");
const bcrypt = require("bcrypt");
const user = require("../model/userSignUp");
const sendOtp = require("../middleware/otpmiddleware.js");
const cart = require("../model/cart");
const mongoose = require("mongoose");
const order = require("../model/order");
const category = require("../model/categories");
const moment = require("moment");
const instance = require("../middleware/razorPay");
const crypto = require("crypto");
const wishlist = require("../model/wishlist");
const coupon = require("../model/coupon");
const dotenv = require("dotenv");
const banner = require("../model/banner");
moment().format();
dotenv.config();

// let session;
var count;
var wishCount;
function checkCoupon(data, id) {
  return new Promise((resolve) => {
    if (data.coupon) {
      coupon
        .find(
          { couponName: data.coupon },
          { users: { $elemMatch: { userId: id } } }
        )
        .then((exist) => {
          if (exist[0].users.length) {
            resolve(true);
          } else {
            coupon.find({ couponName: data.coupon }).then((discount) => {
              resolve(discount);
            });
          }
        });
    } else {
      resolve(false);
    }
  });
}
module.exports = {
  guestHome: async (req, res) => {
    const session = req.session;
    try {
      const banners = await banner.find();
      const Categories = await category.find();
      const allProducts = await products.find({ isDeleted: false }).limit(4);
      res.render("user/userHome", {
        session,
        allProducts,
        count,
        Categories,
        wishCount,
        banners,
      });
    } catch {
      console.error();
      res.render('user/error500');
    }
  },
  getLogin: (req, res) => {
    try {
    const session = req.session.userId;
      if (session) {
        res.redirect("/userhome");
      } else {
        res.render("user/userLogin", { session });
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  gethome: async (req, res) => {
    try {
      const session = req.session.userId;
      if (session) {
        const banners = await banner.find();
        const Categories = await category.find();
        const userData = await user.findOne({ email: session });
        const cartData = await cart.find({ userId: userData._id });
        const wishlistData = await wishlist.find({ userId: userData._id });
        if (wishlistData.length) {
          wishCount = wishlistData[0].product.length;
        } else {
          wishCount = 0;
        }
        if (cartData.length) {
          count = cartData[0].product.length;
        } else {
          count = 0;
        }
        products
          .find({ isDeleted: false })
          .limit(4)
          .then((allProducts) => {
            res.render("user/userHome", {
              session,
              allProducts,
              count,
              Categories,
              wishCount,
              banners,
            });
          });
      } else {
        res.redirect("/user");
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  shop: async (req, res) => {
    try {
      const session = req.session;
      const pageNum = req.query.page;
      const perPage = 12;
      let docCount;
      const Categories = await category.find();
      const userData = await user.findOne({ email: session });
      const cartData = await cart.find({ userId: userData._id });
      const wishlistData = await wishlist.find({ userId: userData._id });
      if (wishlistData.length) {
        wishCount = wishlistData[0].product.length;
      } else {
        wishCount = 0;
      }
      if (cartData.length) {
        count = cartData[0].product.length;
      } else {
        count = 0;
      }
      products
        .find({ isDeleted: false })
        .countDocuments()
        .then((documents) => {
          docCount = documents;
          return products
            .find({ isDeleted: false })
            .skip((pageNum - 1) * perPage)
            .limit(perPage);
        })
        .then((allProducts) => {
          res.render("user/shop", {
            session,
            allProducts,
            count,
            Categories,
            wishCount,
            pageNum,
            docCount,
            pages: Math.ceil(docCount / perPage),
          });
        });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  shopCategory: async (req, res) => {
    try {
      const session = req.session;
      const id = req.params.id;
      const pageNum = req.query.page;
      const perPage = 12;
      let docCount;
      const Categories = await category.find();
      const categoryData = await category.findOne({ _id: id });
      if (categoryData) {
        products
          .find({ category: categoryData.category, isDeleted: false })
          .countDocuments()
          .then((documents) => {
            docCount = documents;
            return products
              .find({ category: categoryData.category, isDeleted: false })
              .skip((pageNum - 1) * perPage)
              .limit(perPage);
          })
          .then((allProducts) => {
            res.render("user/categories", {
              session,
              allProducts,
              count,
              Categories,
              wishCount,
              categoryId: categoryData._id,
              pageNum,
              docCount,
              pages: Math.ceil(docCount / perPage),
            });
          });
      } else {
        res.redirect("/shop");
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  getCategory: async (req, res) => {
    try {
      const session = req.session;
      const id = req.params.id;
      const Categories = await category.find();
      const categoryData = await category.findOne({ _id: id });
      if (categoryData) {
        products
          .find({ category: categoryData.category })
          .then((allProducts) => {
            res.render("user/userHome", {
              session,
              allProducts,
              count,
              Categories,
              wishCount,
            });
          });
      } else {
        res.redirect("/userhome");
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  postLogin: async (req, res) => {
    try {
      const session = req.session;
      let email = req.body.email;
      const userDetails = await User.findOne({ email: email });
      if (userDetails) {
        const blocked = userDetails.isBlocked;
        if (blocked === false) {
          if (userDetails) {
            const value = await bcrypt.compare(
              req.body.password,
              userDetails.password
            );
            if (value) {
              req.session.userId = req.body.email;
              res.redirect("/userhome");
            } else {
              res.render("user/userLogin", {
                session,
                err_message: "email or password incorrect",
              });
            }
          } else {
            res.render("user/userLogin", {
              session,
              err_message: "email not registered",
            });
          }
        } else {
          res.render("user/userLogin", { session, err_message: "Blocked" });
        }
      } else {
        res.render("user/userLogin", {
          session,
          err_message: "email or password incorrect",
        });
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  userLogout: async (req, res) => {
    try {
      
      req.session.destroy();
      res.redirect("/user");
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  getSignup: (req, res) => {
    try {
      const session = req.session;
      res.render("user/userSignup", { session });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  postSignup: (req, res) => {
    try {
      const session = req.session;
      const data = req.body;
      if (data.password === data.confirmpassword) {
        User.find({
          $or: [{ mobile: data.mobile }, { email: data.email }],
        }).then((result) => {
          if (result.length) {
            res.render("user/userSignup", {
              session,
              err_message: "already resistered",
            });
          } else {
            user.find({ username: data.username }).then((result) => {
              if (result.length) {
                res.render("user/userSignup", {
                  session,
                  err_message: "username unavilable",
                });
              } else {
                // const otpc = Math.floor(100000 + Math.random() * 900000);
                // const tonumber = `+91${data.mobile}`;
                // sendOtp.sendOTP(tonumber, otpc);
                // const newOtp = new otpsign({
                //   otp: otpc,
                // });
                // newOtp.save().then(() => {
                //   res.render("user/otpSignup", { session, data });
                // });
                let mailDetails = {
                  from: process.env.GMAIL,
                  to: data.email,
                  subject: "CHOCOLATE CAFE VERIFICATION",
                  html: `<p>YOUR OTP FOR REGISTERING IN CASTLE  IS <h1> ${sendOtp.OTP} <h1> </p>`,
                };
                sendOtp.mailTransporter.sendMail(
                  mailDetails,
                  (err, response) => {
                    if (err) {
                      console.log("error occurs");
                    } else {
                      console.log(response);
                      console.log(data);
                      const newOtp = new otpsign({
                        otp: sendOtp.OTP,
                      });
                      newOtp.save().then(() => {
                        res.render("user/otpSignup", { session, data });
                      });
                    }
                  }
                );
              }
            });
          }
        });
      } else {
        res.render("user/userSignup", {
          session,
          err_message: "password must be same",
        });
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  otpSignup: async (req, res) => {
    try {
      const session = req.session;
      const data = req.body;
      const verify = await otpsign.find({ otp: data.otp });
      if (verify) {
        await otpsign.deleteOne({ _id: verify[0]._id });
        console.log(verify);
        let password = await bcrypt.hash(data.password, 10);
        const newUser = new User({
          username: data.username,
          email: data.email,
          mobile: data.mobile,
          password: password,
        });
        newUser.save().then(() => {
          res.redirect("/user");
        });
      } else {
        res.render("user/otpSignup", {
          session,
          data,
          err_message: "invalid otp",
        });
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  viewProduct: async (req, res) => {
    try {
      const session = req.session;
      let cartExist;
      const id = req.params.id;
      const objId = mongoose.Types.ObjectId(id);
      const userId = req.session.userId;
      const userData = await user.findOne({ email: userId });
      const cartData = await cart.findOne({ userId: userData.id });
      let count = cartData?.product?.length;
      const wishlistData = await wishlist.findOne({ userId: userData._id });
      console.log(wishlistData);
      let wishCount = wishlistData?.product?.length;
      if (wishlistData == null) {
        wishCount = 0;
      }
      if (cartData == null) {
        cartExist = 0;
        count = 0;
      } else {
        const cartLen = await cart.findOne(
          { userId: userData.id },
          { product: { $elemMatch: { productId: objId } } }
        );
        cartExist = cartLen.product.length;
      }
      products.findOne({ _id: id }).then((data) => {
        res.render("user/productView", {
          session,
          data,
          count,
          cartData,
          cartExist,
          wishCount,
        });
      });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  wishlist: async (req, res) => {
    try {
      const session = req.session;
      const userData = await user.findOne({ email: session });
      const userId = mongoose.Types.ObjectId(userData._id);
      const cartData = await cart.findOne({ userId: userData.id });
      let count = cartData?.product?.length;
      const wishlistDetails = await wishlist.findOne({ userId: userData._id });
      console.log(wishlistDetails);
      let wishCount = wishlistDetails?.product?.length;
      if (wishlistDetails == null) {
        wishCount = 0;
      }
      if (cartData == null) {
        count = 0;
      }
      const wishlistData = await wishlist.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productItem: "$product.productId",
          },
        },
        {
          $lookup: {
            from: "productdetails",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetail",
          },
        },
        {
          $project: {
            productItem: 1,
            productDetail: { $arrayElemAt: ["$productDetail", 0] },
          },
        },
      ]);
      res.render("user/wishlist", { session, count, wishlistData, wishCount });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  addToWishlist: async (req, res) => {
    try {
      const session = req.session;
      const id = req.params.id;
      // const data = await products.findOne({ _id: id });
      const objId = mongoose.Types.ObjectId(id);
      let proObj = {
        productId: objId,
      };
      const userData = await user.findOne({ email: session });
      const userId = mongoose.Types.ObjectId(userData._id);
      const userWishlist = await wishlist.findOne({ userId: userId });
      const cartData = await cart.findOne({ userId: userId });
      console.log(cartData);
      const verify = await cart.findOne(
        { userId: userId },
        { product: { $elemMatch: { productId: objId } } }
      );
      if (verify?.product?.length) {
        res.json({ cart: true });
      } else {
        if (userWishlist) {
          let proExist = userWishlist.product.findIndex(
            (product) => product.productId == id
          );
          if (proExist != -1) {
            res.json({ productExist: true });
          } else {
            wishlist
              .updateOne({ userId: userId }, { $push: { product: proObj } })
              .then(() => {
                res.json({ status: true });
              });
          }
        } else {
          wishlist
            .create({
              userId: userId,
              product: [
                {
                  productId: objId,
                },
              ],
            })
            .then(() => {
              res.json({ status: true });
            });
        }
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  removewishlistProduct: async (req, res) => {
    try {
      const data = req.body;
      const objId = mongoose.Types.ObjectId(data.productId);
      await wishlist.aggregate([
        {
          $unwind: "$product",
        },
      ]);
      await wishlist
        .updateOne(
          { _id: data.wishlistId, "product.productId": objId },
          { $pull: { product: { productId: objId } } }
        )
        .then(() => {
          res.json({ status: true });
        });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  addCart: async (req, res) => {
    
      const id = req.params.id;
      const userId = req.session.userId;
      const data = await products.findOne({ _id: id });
      const userData = await user.findOne({ email: userId });
      const objId = mongoose.Types.ObjectId(id);

      const idUser = mongoose.Types.ObjectId(userData._id);
      let proObj = {
        productId: objId,
        quantity: 1,
      };
      if (data.stock >= 1) {
        const userCart = await cart.findOne({ userId: userData._id });
        if (userCart) {
          let proExist = userCart.product.findIndex(
            (product) => product.productId == id
          );
          if (proExist != -1) {
            // await cart.aggregate([
            //   {
            //     $unwind: "$product",
            //   },
            // ]);
            // await cart.updateOne(
            //   { userId: userData._id, "product.productId": objId },
            //   { $inc: { "product.$.quantity": 1 } }
            // );
            res.json({ productExist: true });
          } else {
            cart
              .updateOne(
                { userId: userData._id },
                { $push: { product: proObj } }
              )
              .then(() => {
                wishlist
                  .updateOne(
                    { userId: idUser },
                    { $pull: { product: { productId: objId } } }
                  )
                  .then(() => {
                    res.json({ status: true });
                  });
              });
          }
        } else {
          const newCart = new cart({
            userId: userData._id,
            product: [
              {
                productId: objId,
                quantity: 1,
              },
            ],
          });
          newCart.save().then(() => {
            res.json({ status: true });
          });
        }
      } else {
        res.json({ stock: true });
      }
    
  },
  viewCart: async (req, res) => {
    try {
      const session = req.session;
      const userId = req.session.userId;
      const userData = await user.findOne({ email: userId });
      const wishlistDetails = await wishlist.findOne({ userId: userData._id });
      console.log(wishlistDetails);
      let wishCount = wishlistDetails?.product?.length;
      if (wishlistDetails == null) {
        wishCount = 0;
      }
      const productData = await cart.aggregate([
        {
          $match: { userId: userData.id },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productItem: "$product.productId",
            productQuantity: "$product.quantity",
          },
        },
        {
          $lookup: {
            from: "productdetails",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetail",
          },
        },
        {
          $project: {
            productItem: 1,
            productQuantity: 1,
            productDetail: { $arrayElemAt: ["$productDetail", 0] },
          },
        },
        {
          $addFields: {
            productPrice: {
              $sum: { $multiply: ["$productQuantity", "$productDetail.price"] },
            },
          },
        },
      ]);
      const sum = productData.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
      }, 0);
      count = productData.length;
      res.render("user/cart", { session, productData, count, sum, wishCount });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  totalAmount: async (req, res) => {
    try {
      const userId = req.session.userId;
      const userData = await user.findOne({ email: userId });
      const productData = await cart.aggregate([
        {
          $match: { userId: userData.id },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productItem: "$product.productId",
            productQuantity: "$product.quantity",
          },
        },
        {
          $lookup: {
            from: "productdetails",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetail",
          },
        },
        {
          $project: {
            productItem: 1,
            productQuantity: 1,
            productDetail: { $arrayElemAt: ["$productDetail", 0] },
          },
        },
        {
          $addFields: {
            productPrice: {
              $multiply: ["$productQuantity", "$productDetail.price"],
            },
          },
        },
        {
          $group: {
            _id: userId,
            total: {
              $sum: { $multiply: ["$productQuantity", "$productDetail.price"] },
            },
          },
        },
      ]);
      res.json({ status: true, productData });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  changeQuantity: async (req, res, next) => {
    try {
      const data = req.body;
      data.count = parseInt(data.count);
      data.quantity = parseInt(data.quantity);
      const objId = mongoose.Types.ObjectId(data.product);
      const productDetail = await products.findOne({ _id: data.product });
      if (data.count == -1 && data.quantity == 1) {
        res.json({ quantity: true });
      } else if (data.count == 1 && data.quantity == productDetail.stock) {
        res.json({ stock: true });
      } else {
        await cart
          .aggregate([
            {
              $unwind: "$product",
            },
          ])
          .then(() => {
            cart
              .updateOne(
                { _id: data.cart, "product.productId": objId },
                { $inc: { "product.$.quantity": data.count } }
              )
              .then(() => {
                next();
              });
          });
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  removeProduct: async (req, res) => {
    try {
      const data = req.body;
      const objId = mongoose.Types.ObjectId(data.product);
      await cart.aggregate([
        {
          $unwind: "$product",
        },
      ]);
      await cart
        .updateOne(
          { _id: data.cart, "product.productId": objId },
          { $pull: { product: { productId: objId } } }
        )
        .then(() => {
          res.json({ status: true });
        });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  viewCheckout: async (req, res) => {
    try {
      const session = req.session;
      const userId = req.session.userId;
      const userData = await user.findOne({ email: userId });
      const productDAta = await cart
        .aggregate([
          {
            $match: { userId: userData.id },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              productItem: "$product.productId",
              productQuantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: "productdetails",
              localField: "productItem",
              foreignField: "_id",
              as: "productDetail",
            },
          },
          {
            $project: {
              productItem: 1,
              productQuantity: 1,
              productDetail: { $arrayElemAt: ["$productDetail", 0] },
            },
          },
          {
            $addFields: {
              productPrice: {
                $multiply: ["$productQuantity", "$productDetail.price"],
              },
            },
          },
        ])
        .exec();
      const sum = productDAta.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
      }, 0);
      count = productDAta.length;
      res.render("user/checkout", {
        session,
        productDAta,
        count,
        sum,
        userData,
        wishCount,
      });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  account: async (req, res) => {
    try {
      const session = req.session;
      const userDetails = await user.findOne({ email: session });
       const wishlistData = await wishlist.findOne({ userId: userDetails._id });
       let wishCount = wishlistData?.product?.length;
       if (wishlistData == null) {
         wishCount = 0;
       }
      const userData = await user.findOne({ email: session });
      res.render("user/accountDetails", {
        userData,
        session,
        count,
        wishCount,
      });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  editAccount: async (req, res) => {
    try {
      const session = req.session;
      const userData = await user.findOne({ email: session });
      res.render("user/editAccount", { userData, session, count, wishCount });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  postEditAccount: async (req, res) => {
    try {
      const session = req.session;
      const data = req.body;
      await user.updateOne(
        { email: session },
        {
          $set: {
            fullname: data.fullname,
            username: data.username,
            email: data.email,
            password: data.password,
            mobile: data.mobile,
            permanentAddress: {
              housename: data.housename,
              area: data.area,
              landmark: data.landmark,
              city: data.city,
              state: data.state,
              pincode: data.pincode,
            },
          },
        }
      );
      res.redirect("/account");
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  changePassword: (req, res) => {
    try {
      const session = req.session;
      res.render("user/changePassword", { session, count, wishCount });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  postChangePassword: async (req, res) => {
    try {
      const session = req.session;
      const data = req.body;
      if (data.newPassword === data.repeatPassword) {
        const userData = await user.findOne({ email: session });
        const value = await bcrypt.compare(data.password, userData.password);
        if (value) {
          let password = await bcrypt.hash(data.newPassword, 10);
          user
            .updateOne({ email: session }, { $set: { password: password } })
            .then(() => {
              req.session.destroy();
              res.redirect("/user");
            });
        } else {
          res.render("user/changePassword", {
            session,
            count,
            wishCount,
            err_message: "password is incorrect",
          });
        }
      } else {
        res.render("user/changePassword", {
          session,
          count,
          wishCount,
          err_message: "password must be same",
        });
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  placeOrder: async (req, res) => {
    try {
      const session = req.session;
      const data = req.body;
      console.log(data);
      let invalid;
      const userData = await user.findOne({ email: session });
      console.log(userData);
      if (userData.permanentAddress.housename !== "" || data.housename) {
        const objId = mongoose.Types.ObjectId(userData._id);
        if (data.coupon) {
          invalid = await coupon.findOne({ couponName: data.coupon });
        } else {
          invalid = 0;
        }
        if (invalid == null) {
          res.json({ invalid: true });
        } else {
          const discount = await checkCoupon(data, objId);
          if (discount == true) {
            res.json({ coupon: true });
          } else {
            const cartData = await cart.findOne({ userId: userData._id });
            if (cartData) {
              const productData = await cart
                .aggregate([
                  {
                    $match: { userId: userData.id },
                  },
                  {
                    $unwind: "$product",
                  },
                  {
                    $project: {
                      productItem: "$product.productId",
                      productQuantity: "$product.quantity",
                    },
                  },
                  {
                    $lookup: {
                      from: "productdetails",
                      localField: "productItem",
                      foreignField: "_id",
                      as: "productDetail",
                    },
                  },
                  {
                    $project: {
                      productItem: 1,
                      productQuantity: 1,
                      productDetail: { $arrayElemAt: ["$productDetail", 0] },
                    },
                  },
                  {
                    $addFields: {
                      productPrice: {
                        $multiply: ["$productQuantity", "$productDetail.price"],
                      },
                    },
                  },
                ])
                .exec();

              const sum = productData.reduce((accumulator, object) => {
                return accumulator + object.productPrice;
              }, 0);
              if (discount == false) {
                var total = sum;
              } else {
                var dis = sum * discount[0].discount;
                if (dis > discount[0].maxLimit) {
                  total = sum - 100;
                  dis = 100;
                } else {
                  total = dis;
                }
              }
              count = productData.length;
              if (data.checkbox === "permanentAddress") {
                const orderData = await order.create({
                  userId: userData._id,
                  username: userData.username,
                  mobile: userData.mobile,
                  address: {
                    housename: userData.permanentAddress.housename,
                    area: userData.permanentAddress.area,
                    landmark: userData.permanentAddress.landmark,
                    city: userData.permanentAddress.city,
                    state: userData.permanentAddress.state,
                    pincode: userData.permanentAddress.pincode,
                  },
                  orderItems: cartData.product,
                  totalAmount: total,
                  paymentMethod: data.paymentMethod,
                  orderStatus: "Pending",
                  orderDate: moment().format("MMM Do YY"),
                  deliveryDate: moment().add(3, "days").format("MMM Do YY"),
                  discount: dis,
                });
                const amount = orderData.totalAmount * 100;
                const _id = orderData._id;
                await cart.deleteOne({ userId: userData._id });
                if (req.body.paymentMethod === "COD") {
                  res.json({ success: true });
                  coupon
                    .updateOne(
                      { couponName: data.coupon },
                      { $push: { users: { userId: objId } } }
                    )
                    .then((updated) => {
                      console.log(updated);
                    });
                } else if (req.body.paymentMethod === "Online") {
                  let options = {
                    amount: amount,
                    currency: "INR",
                    receipt: "" + _id,
                  };
                  instance.orders.create(options, function (err, order) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.json(order);
                      coupon
                        .updateOne(
                          { couponName: data.coupon },
                          { $push: { users: { userId: objId } } }
                        )
                        .then((updated) => {
                          console.log(updated);
                        });
                    }
                  });
                }
              } else {
                await user.updateOne(
                  { email: session },
                  {
                    $set: {
                      shippingAddress: {
                        housename: data.housename,
                        area: data.area,
                        landmark: data.landmark,
                        city: data.city,
                        state: data.state,
                        pincode: data.pincode,
                      },
                    },
                  }
                );
                const userData = await user.findOne({ email: session });
                const orderData = await order.create({
                  userId: userData._id,
                  username: userData.username,
                  mobile: userData.mobile,
                  address: {
                    housename: userData.shippingAddress.housename,
                    area: userData.shippingAddress.area,
                    landmark: userData.shippingAddress.landmark,
                    city: userData.shippingAddress.city,
                    state: userData.shippingAddress.state,
                    pincode: userData.shippingAddress.pincode,
                  },
                  orderItems: cartData.product,
                  totalAmount: sum,
                  paymentMethod: data.paymentMethod,
                  orderStatus: "Pending",
                  orderDate: moment().format("MMM Do YY"),
                  deliveryDate: moment().add(3, "days").format("MMM Do YY"),
                });
                const amount = orderData.totalAmount * 100;
                const _id = orderData._id;
                await cart.deleteOne({ userId: userData._id });
                if (req.body.paymentMethod === "COD") {
                  res.json({ success: true });
                  coupon
                    .updateOne(
                      { couponName: data.coupon },
                      { $push: { users: { userId: objId } } }
                    )
                    .then((updated) => {
                      console.log(updated);
                    });
                } else if (req.body.paymentMethod === "Online") {
                  let options = {
                    amount: amount,
                    currency: "INR",
                    receipt: "" + _id,
                  };
                  instance.orders.create(options, function (err, order) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.json(order);
                      coupon
                        .updateOne(
                          { couponName: data.coupon },
                          { $push: { users: { userId: objId } } }
                        )
                        .then((updated) => {
                          console.log(updated);
                        });
                    }
                  });
                }
              }
              console.log(productData);
              for (let i = 0; i < productData.length; i++) {
                const updatedStock =
                  productData[i].productDetail.stock -
                  productData[i].productQuantity;
                products
                  .updateOne(
                    {
                      _id: productData[i].productDetail._id,
                    },
                    {
                      stock: updatedStock,
                    }
                  )
                  .then((data) => {
                    console.log(data);
                  });
              }
            } else {
              res.redirect("/cart");
            }
          }
        }
      } else {
        res.json({ address: true });
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  verifyPayment: (req, res) => {
    try {
      const details = req.body;
      let hmac = crypto.createHmac("sha256", process.env.KETSECRET);
      hmac.update(
        details.payment.razorpay_order_id +
          "|" +
          details.payment.razorpay_payment_id
      );
      hmac = hmac.digest("hex");
      if (hmac == details.payment.razorpay_signature) {
        const objId = mongoose.Types.ObjectId(details.order.receipt);
        console.log(objId);
        order
          .updateOne({ _id: objId }, { $set: { paymentStatus: "paid" } })
          .then(() => {
            res.json({ success: true });
          })
          .catch((err) => {
            console.log(err);
            res.json({ status: false, err_message: "payment failed" });
          });
      } else {
        res.json({ status: false, err_message: "payment failed" });
      }
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  paymentFailure: (req, res) => {
    try {
      const session = req.session;
      const details = req.body;
      console.log(details);
      res.render("user/paymentFail", { session, count, wishCount });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  orderSuccess: async (req, res) => {
    try {
      const session = req.session;
      const count = 0;
      res.render("user/orderSuccess", { session, count, wishCount });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  viewOrderProducts:async (req, res) => {
    try {
      const session = req.session;
      const id = req.params.id;
      const objId = mongoose.Types.ObjectId(id);
      const userData = await user.findOne({ email: session });
       const cartData = await cart.findOne({ userId: userData.id });
      let count = cartData?.product?.length;
      const wishlistDetails = await wishlist.findOne({ userId: userData._id });
      console.log(wishlistDetails);
      let wishCount = wishlistDetails?.product?.length;
      if (wishlistDetails == null) {
        wishCount = 0;
      }
      if (cartData == null) {
        count = 0;
      }
      order
        .aggregate([
          {
            $match: { _id: objId },
          },
          {
            $unwind: "$orderItems",
          },
          {
            $project: {
              address: "$address",
              totalAmount: "$totalAmount",
              mobile: "$mobile",
              productItem: "$orderItems.productId",
              productQuantity: "$orderItems.quantity",
              discount: "$discount",
            },
          },
          {
            $lookup: {
              from: "productdetails",
              localField: "productItem",
              foreignField: "_id",
              as: "productDetail",
            },
          },
          {
            $project: {
              address: 1,
              totalAmount: 1,
              mobile: 1,
              productItem: 1,
              productQuantity: 1,
              discount: 1,
              productDetail: { $arrayElemAt: ["$productDetail", 0] },
            },
          },
        ])
        .then((productData) => {
          res.render("user/viewOrderProducts", {
            session,
            count,
            productData,
            wishCount,
          });
        });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  orderDetails: async (req, res) => {
    try {
      const session = req.session;
      const pageNum = req.query.page;
      const perPage = 8;
      let docCount;
      const userData = await user.findOne({ email: session });
      const cartData = await cart.findOne({ userId: userData.id });
      let count = cartData?.product?.length;
      const wishlistData = await wishlist.findOne({ userId: userData._id });
      let wishCount = wishlistData?.product?.length;
      if (wishlistData == null) {
        wishCount = 0;
      }
      if (cartData == null) {
        count = 0;
      }
      order
        .find({ userId: userData._id })
        .countDocuments()
        .then((documents) => {
          docCount = documents;
          return order
            .find({ userId: userData._id })
            .sort({ orderDate: -1 })
            .skip((pageNum - 1) * perPage)
            .limit(perPage);
        })
        .then((orderDetails) => {
          res.render("user/orders", {
            session,
            count,
            wishCount,
            orderDetails,
            pageNum,
            docCount,
            pages: Math.ceil(docCount / perPage),
          });
        });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const data = req.params.id;
      const objId = mongoose.Types.ObjectId(data);
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
      order
        .updateOne({ _id: data }, { $set: { orderStatus: "cancelled" } })
        .then(() => {
          res.redirect("/orderDetails");
        });
    } catch {
      console.error();
      res.render("user/error500");
    }
  },
  about:(req,res)=>{
    const session = req.session;
    res.render('user/about',{session ,count,wishCount});
  }
};
