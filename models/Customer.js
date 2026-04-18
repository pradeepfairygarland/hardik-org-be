const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
{
  c_name: {
    type: String,
    required: true,
    unique: true,   // optional but recommended
    trim: true
  },
  c_contact: {
    type: Number,
    required: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema, "mst_customer");