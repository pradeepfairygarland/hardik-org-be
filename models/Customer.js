const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
{
  c_name: {
    type: String,
    required: true,
    unique: true,   // optional but recommended
    trim: true
  },
  c_shop_name: {
    type: String,
    required: true,
    unique: true,   // optional but recommended
    trim: true
  },
  c_contact: {
    type: Number,
    required: true
  },
  is_active: {
    type: Number,
    default: 1
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema, "mst_customer");