const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
{
  v_name: {
    type: String,
    required: true,
    unique: true,   
  },
  v_poc_name: String,
  v_contact: String,
  v_poc_contact: String,
  v_address: String
},
{ timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema, "mst_vendor");