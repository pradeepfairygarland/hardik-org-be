const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    item_quantity: {
      type: Number,
      required: true,
      min: 1
    },
    item_rate: {
      type: Number,
      required: true,
      min: 0
    },
    discount_percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    item_amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: true }
);

const purchaseSchema = new mongoose.Schema(
  {
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },
    purchase_date: {
      type: Date,
      default: Date.now
    },
    items: {
      type: [purchaseItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "Purchase must have at least one item"
      }
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0
    },
    gst_percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    gst_amount: {
      type: Number,
      default: 0,
      min: 0
    },
    round_off_amt: {
      type: Number,
      default: 0
    },
    final_amount: {
      type: Number,
      required: true,
      min: 0
    },
    is_active: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema, "trn_purchase");
