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

let session;
var count;
module.exports = {
  guestHome: async (req, res) => {
    try {
      const Categories = await category.find();
      const allProducts = await products.find({ isDeleted: false });
      res.render("user/userHome", { session, allProducts, count, Categories });
    } catch {
      console.error();
    }
  },
  getLogin: (req, res) => {
    try {
      session = req.session.userId;
      if (session) {
        res.redirect("/userhome");
      } else {
        res.render("user/userLogin", { session });
      }
    } catch {
      console.error();
    }
  },
  gethome: async (req, res) => {
    try {
      session = req.session.userId;
      if (session) {
        const Categories = await category.find();
        const userData = await user.findOne({ email: session });
        const productDAta = await cart.find({ userId: userData._id });
        if (productDAta.length) {
          count = productDAta[0].product.length;
        } else {
          count = 0;
        }
        products.find({ isDeleted: false }).then((allProducts) => {
          res.render("user/userHome", {
            session,
            allProducts,
            count,
            Categories,
          });
        });
      } else {
        res.redirect("/user");
      }
    } catch {
      console.error();
    }
  },
  getCategory:async (req, res) => {
    const id = req.params.id;
    const Categories = await category.find();
    const categoryData = await category.findOne({_id:id});
    if(categoryData){
    products.find({category:categoryData.category}).then((allProducts)=>{
      res.render("user/userHome", {
        session,
        allProducts,
        count,
        Categories,
      });
    })
  }else{
    res.redirect('/userhome');
  }
  },
  postLogin: async (req, res) => {
    try {
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
    }
  },
  userLogout: async (req, res) => {
    req.session.destroy();
    res.redirect("/user");
  },
  getSignup: (req, res) => {
    res.render("user/userSignup", { session });
  },
  postSignup: (req, res) => {
    try {
      const data = { ...req.body };
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
                const otpc = Math.floor(100000 + Math.random() * 900000);
                const tonumber = `+91${data.mobile}`;
                sendOtp.sendOTP(tonumber, otpc);
                const newOtp = new otpsign({
                  otp: otpc,
                });
                newOtp.save().then(() => {
                  res.render("user/otpSignup", { session, data });
                });
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
    }
  },
  otpSignup: async (req, res) => {
    try {
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
    }
  },
  viewProduct: async (req, res) => {
    try {
      const id = req.params.id;
      products.findOne({ _id: id }).then((data) => {
        res.render("user/productView", { session, data, count });
      });
    } catch {
      console.error();
    }
  },

  addCart: async (req, res) => {
    const id = req.params.id;
    const data = await products.findOne({ _id: id });
    const objId = mongoose.Types.ObjectId(id);
    const userId = req.session.userId;
    let proObj = {
      productId: objId,
      quantity: 1,
    };
    if (data.stock >= 1) {
      const userData = await user.findOne({ email: userId });
      const userCart = await cart.findOne({ userId: userData._id });
      if (userCart) {
        let proExist = userCart.product.findIndex(
          (product) => product.productId == id
        );
        if (proExist != -1) {
          await cart.aggregate([
            {
              $unwind: "$product",
            },
          ]);
          await cart.updateOne(
            { userId: userData._id, "product.productId": objId },
            { $inc: { "product.$.quantity": 1 } }
          );
          res.redirect("/userhome");
        } else {
          cart
            .updateOne({ userId: userData._id }, { $push: { product: proObj } })
            .then(() => {
              res.json({ status: true });
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
      res.json({ status: false });
    }
  },
  viewCart: async (req, res) => {
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
            $sum: { $multiply: ["$productQuantity", "$productDetail.price"] },
          },
        },
      },
    ]);
    const sum = productData.reduce((accumulator, object) => {
      return accumulator + object.productPrice;
    }, 0);
    count = productData.length;
    res.render("user/cart", { session, productData, count, sum });
  },
  changeQuantity: async (req, res) => {
    const data = req.body;
    const objId = mongoose.Types.ObjectId(data.product);
    await cart
      .aggregate([
        {
          $unwind: "$product",
        },
      ])
      .then(() => {});
    await cart
      .updateOne(
        { _id: data.cart, "product.productId": objId },
        { $inc: { "product.$.quantity": data.count } }
      )
      .then(() => {
        res.json({ status: true });
      });
  },
  removeProduct: async (req, res) => {
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
  },
  viewCheckout: async (req, res) => {
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
    res.render("user/checkout", { session, productDAta, count, sum, userData });
  },
  account: async (req, res) => {
    const userData = await user.findOne({ email: session });
    res.render("user/accountDetails", { userData, session, count });
  },
  editAccount: async (req, res) => {
    const userData = await user.findOne({ email: session });
    res.render("user/editAccount", { userData, session, count });
  },
  postEditAccount: async (req, res) => {
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
          addressDetails: [
            {
              housename: data.housename,
              area: data.area,
              landmark: data.landmark,
              city: data.city,
              state: data.state,
              pincode: data.pincode,
            },
          ],
        },
      }
    );
    res.redirect("/account");
  },
  addAddress: (req, res) => {
    console.log(req.body);
    const data = req.body;
    const addobj = {
      housename: data.housename,
      area: data.area,
      landmark: data.landmark,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    };
    console.log(req.params.id);
    user
      .updateOne({ email: session }, { $push: { addressDetails: addobj } })
      .then(() => {
        res.redirect("/checkout");
      });
  },
  changePassword: (req, res) => {
    res.render("user/changePassword", { session, count });
  },
  postChangePassword: async (req, res) => {
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
          err_message: "password is incorrect",
        });
      }
    } else {
      res.render("user/changePassword", {
        session,
        count,
        err_message: "password must be same",
      });
    }
  },
  placeOrder: async (req, res) => {
    const userData = await user.findOne({ email: session });
    const cartData = await cart.findOne({ userId: userData._id });
    console.log(cartData);
    const status = req.body.paymentMethod === "COD" ? "placed" : "pending";
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
      console.log(productData);
      const sum = productData.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
      }, 0);
      const stocks = productData.map((x) => x.productItem);
      console.log(stocks);
      count = productData.length;
      const date = new Date();
      const deliveryDate = date.setDate(date.getDate() + 10);
      order.create({
        userId: userData._id,
        fullname: userData.fullname,
        mobile: userData.mobile,
        address: req.body.address,
        orderItems: cartData.product,
        totalAmount: sum,
        paymentMethod: req.body.paymentMethod,
        orderStatus: status,
        orderDate:date,
        deliveryDate:deliveryDate
      });
      cart.deleteOne({ userId: userData._id }).then(() => {
        // res.render("user/orderSuccess", { session, count });
        res.json({status:true});
      });
      console.log(productData.productQuantity);
      // products.updateMany({ _id: stocks }, [
      //   { $set: { stock: { $subtract:["$stock","$productData.productQuantity"]} } }, 
      // ]).then((data)=>{
      //   console.log(data);
      // })
      // products
      //   .updateMany({ _id: stocks }, { $inc: { stock: -1} })
      //   .then((stock) => {
      //     console.log(stock);
      //   });
      // products.find({_id:stocks}).then((data)=>{
      //   console.log("hiii"+data);
      // })
    } else {
      res.redirect("/cart");
    }
  },
  orderSuccess:async(req,res)=>{
   const count = 0;
    res.render("user/orderSuccess", { session, count });
  },
  viewOrderProducts:(req,res)=>{
    const id = req.params.id;
    const objId = mongoose.Types.ObjectId(id);
    order.aggregate([
      {
        $match: { _id: objId },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $project: {
          productItem: "$orderItems.productId",
          productQuantity: "$orderItems.quantity",
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
    ]).then((productData)=>{
      console.log(productData);
      res.render('user/viewOrderProducts',{session,count,productData});
    })
  },
  orderDetails: async (req, res) => {
    const userData = await user.findOne({ email: session });
    const productData = await order.aggregate([
      {
        $match: { userId: userData._id },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $project: {
          userId: "$userId",
          fullname: "$fullname",
          mobile: "$mobile",
          address: "$address",
          totalAmount: "$totalAmount",
          paymentMethod: "$paymentMethod",
          paymentStatus: "$paymentStatus",
          createdAt: "$createdAt",
          productItem: "$orderItems.productId",
          productQuantity: "$orderItems.quantity",
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
          userId: 1,
          fullname: 1,
          mobile: 1,
          address: 1,
          totalAmount: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          createdAt: 1,
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
    ]);
    await order.find({ userId: userData._id }).then((orderDetails) => {
      res.render("user/orderDetails", {
        session,
        count,
        orderDetails,
        productData,
      });
    });
  },
  cancelOrder: (req, res) => {
    const data = req.params.id;
    console.log(data);
    order
      .updateOne({ _id: data }, { $set: { orderStatus: "cancelled" } })
      .then((data) => {
        console.log(data);
        res.redirect("/orderDetails");
      });
  },
};
