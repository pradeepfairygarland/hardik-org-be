const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  p_name: {
    type: String,
    required: true,
    unique: true,   
  },
  is_active: {
    type: Number,
    default: 1
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema, "mst_product");