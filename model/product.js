const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  product: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const product = mongoose.model("productdetails", productSchema);
module.exports = product;
