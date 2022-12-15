const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BannerSchema = new Schema(
  {
    banner: {
      type: String,
      required: true,
    },
    bannerText: {
      type: String,
      required: true,
    },
    couponName: {
      type: String,
      required: true,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("banners", BannerSchema);
