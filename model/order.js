const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    address: {
      housename: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    orderItems: [
      {
        productId: {
          type: ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: "not paid",
    },
    orderDate: {
      type: String,
    },
    deliveryDate: {
      type: String,
    },
    discount:{
      type:Number
    }
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("orderDetails", orderSchema);
module.exports = order;
