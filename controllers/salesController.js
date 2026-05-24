const Sale = require("../models/Sales");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// Helper function to calculate final amount
const calculateAmounts = (totalAmount, gstPercent = 0, roundOffAmt = 0) => {
  const gstAmount = (totalAmount * gstPercent) / 100;
  const finalAmount = totalAmount + gstAmount + roundOffAmt;
  
  return {
    gstAmount: Math.round(gstAmount * 100) / 100,
    finalAmount: Math.round(finalAmount * 100) / 100
  };
};

// CREATE Sale Transaction
exports.createSale = async (req, res) => {
  try {
    const { customer_id, sales_date, items, gst_percent = 0, round_off_amt = 0 } = req.body;

    // Validate customer exists
    const customer = await Customer.findById(customer_id);
    if (!customer || customer.is_active !== 1) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Validate all products exist and calculate total amount
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product || product.is_active !== 1) {
        return res
          .status(404)
          .json({ message: `Product ${item.product_id} not found` });
      }

      // Calculate item amount: (quantity * rate) - discount
      const baseAmount = item.item_quantity * item.item_rate;
      const discountAmount = (baseAmount * item.discount_percent) / 100;
      const itemAmount = baseAmount - discountAmount;

      validatedItems.push({
        product_id: item.product_id,
        item_quantity: item.item_quantity,
        item_rate: item.item_rate,
        discount_percent: item.discount_percent || 0,
        item_amount: itemAmount
      });

      totalAmount += itemAmount;
    }

    // Calculate GST and final amount
    const { gstAmount, finalAmount } = calculateAmounts(totalAmount, gst_percent, round_off_amt);

    // Create sale transaction
    const sale = await Sale.create({
      customer_id,
      sales_date: sales_date || Date.now(),
      items: validatedItems,
      total_amount: totalAmount,
      gst_percent,
      gst_amount: gstAmount,
      round_off_amt,
      final_amount: finalAmount
    });

    // Populate references for response
    const populatedSale = await Sale.findById(sale._id)
      .populate("customer_id")
      .populate("items.product_id");

    res.status(201).json(populatedSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL Sale Transactions
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ is_active: 1 })
      .populate("customer_id", "c_name c_contact")
      .populate("items.product_id", "p_name p_price")
      .sort({ sales_date: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE Sale Transaction
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customer_id")
      .populate("items.product_id");

    if (!sale || sale.is_active !== 1) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET Sales by Customer
exports.getSalesByCustomer = async (req, res) => {
  try {
    const sales = await Sale.find({
      customer_id: req.params.customer_id,
      is_active: 1
    })
      .populate("customer_id", "c_name c_contact")
      .populate("items.product_id", "p_name p_price")
      .sort({ sales_date: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE Sale Transaction
exports.updateSale = async (req, res) => {
  try {
    const { items, customer_id, sales_date, gst_percent = 0, round_off_amt = 0 } = req.body;

    // Validate customer if being updated
    if (customer_id) {
      const customer = await Customer.findById(customer_id);
      if (!customer || customer.is_active !== 1) {
        return res.status(404).json({ message: "Customer not found" });
      }
    }

    let updateData = { customer_id, sales_date, gst_percent, round_off_amt };
    let totalAmount = 0;
    let validatedItems = [];

    // If items are being updated, validate and recalculate
    if (items && items.length > 0) {
      for (const item of items) {
        const product = await Product.findById(item.product_id);
        if (!product || product.is_active !== 1) {
          return res
            .status(404)
            .json({ message: `Product ${item.product_id} not found` });
        }

        const baseAmount = item.item_quantity * item.item_rate;
        const discountAmount = (baseAmount * item.discount_percent) / 100;
        const itemAmount = baseAmount - discountAmount;

        validatedItems.push({
          product_id: item.product_id,
          item_quantity: item.item_quantity,
          item_rate: item.item_rate,
          discount_percent: item.discount_percent || 0,
          item_amount: itemAmount
        });

        totalAmount += itemAmount;
      }

      updateData.items = validatedItems;
      updateData.total_amount = totalAmount;

      // Calculate GST and final amount
      const { gstAmount, finalAmount } = calculateAmounts(totalAmount, gst_percent, round_off_amt);
      updateData.gst_amount = gstAmount;
      updateData.final_amount = finalAmount;
    } else {
      // If only GST or round-off is being updated, recalculate with existing total
      const sale = await Sale.findById(req.params.id);
      if (sale) {
        const { gstAmount, finalAmount } = calculateAmounts(sale.total_amount, gst_percent, round_off_amt);
        updateData.gst_amount = gstAmount;
        updateData.final_amount = finalAmount;
      }
    }

    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("customer_id")
      .populate("items.product_id");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE Sale Transaction (Soft Delete)
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { is_active: 0 },
      { new: true }
    );

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
