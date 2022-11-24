const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
});

const category = mongoose.model("categories", categoriesSchema);
module.exports = category;
