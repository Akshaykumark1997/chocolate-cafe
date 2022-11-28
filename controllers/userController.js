const User = require("../model/userSignUp");
const products = require("../model/product");
const otpsign = require("../model/otp");
const bcrypt = require("bcrypt");
const user = require("../model/userSignUp");
const sendOtp = require("../middleware/otpmiddleware.js");
const cart = require("../model/cart");
const mongoose = require("mongoose");

let session;
var count;
module.exports = {
  guestHome: async (req, res) => {
    try {
      const allProducts = await products.find({ isDeleted: false });
      res.render("user/userHome", { session, allProducts, count });
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
        const userData = await user.findOne({ email: session });
        const productDAta = await cart.find({ userId: userData._id });
        if (productDAta.length) {
          count = productDAta[0].product.length;
        } else {
          count = 0;
        }
        products.find({ isDeleted: false }).then((allProducts) => {
          res.render("user/userHome", { session, allProducts, count });
        });
      } else {
        res.redirect("/user");
      }
    } catch {
      console.error();
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
  viewProduct: (req, res) => {
    try {
      const id = req.params.id;
      products.find({ _id: id }).then((data) => {
        res.render("user/productView", { session, data, count });
      });
    } catch {
      console.error();
    }
  },

  addCart: async (req, res) => {
    const id = req.params.id;
    const objId = mongoose.Types.ObjectId(id);
    const userId = req.session.userId;
    let proObj = {
      productId: objId,
      quantity: 1,
    };
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
        
        // res.redirect("/userhome");
        res.json({ status: true });
      });
    }
  },
  viewCart: async (req, res) => {
    const userId = req.session.userId;
    const userData = await user.findOne({ email: userId });
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
      ])
      .exec(); 
      count = productData.length;
    res.render("user/cart", { session, productData, count });
  },
  changeQuantity:async(req,res)=>{
    const data = req.body;
    const objId = mongoose.Types.ObjectId(data.product);
    await cart
      .aggregate([
        {
          $unwind: "$product",
        },
      ])
      .then((data) => {
        console.log(data);
      });
     await cart.updateOne(
      { _id: data.cart, "product.productId": objId },
      { $inc: { "product.$.quantity": data.count } }
    ).then(()=>{
      res.json({status:true});
    })
     
  },
  removeProduct:async(req,res)=>{
    const data = req.body;
    const objId = mongoose.Types.ObjectId(data.product);
    await cart.aggregate([
      {
        $unwind:"$product"
      }
    ])
    await cart
      .updateOne(
        { _id: data.cart, "product.productId": objId },
        { $pull: { product: { productId: objId } } }
      )
      .then(() => {
        res.json({status:true});
      });

  }
};
