const mongoose = require("mongoose");

const salesItemSchema = new mongoose.Schema(
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

const salesSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    sales_date: {
      type: Date,
      default: Date.now
    },
    items: {
      type: [salesItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "Sale must have at least one item"
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

module.exports = mongoose.model("Sales", salesSchema, "trn_sales");
