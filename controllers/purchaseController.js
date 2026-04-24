const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");

// ✅ Helper function to calculate final amount
const calculateAmounts = (totalAmount, gstPercent = 0, roundOffAmt = 0) => {
  const gstAmount = (totalAmount * gstPercent) / 100;
  const finalAmount = totalAmount + gstAmount + roundOffAmt;
  
  return {
    gstAmount: Math.round(gstAmount * 100) / 100,
    finalAmount: Math.round(finalAmount * 100) / 100
  };
};

// ✅ CREATE Purchase Transaction
exports.createPurchase = async (req, res) => {
  try {
    const { vendor_id, purchase_date, items, gst_percent = 0, round_off_amt = 0 } = req.body;

    // Validate vendor exists
    const vendor = await Vendor.findById(vendor_id);
    if (!vendor || vendor.is_active !== 1) {
      return res.status(404).json({ message: "Vendor not found" });
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

    // Create purchase transaction
    const purchase = await Purchase.create({
      vendor_id,
      purchase_date: purchase_date || Date.now(),
      items: validatedItems,
      total_amount: totalAmount,
      gst_percent,
      gst_amount: gstAmount,
      round_off_amt,
      final_amount: finalAmount
    });

    // Populate references for response
    await purchase.populate("vendor_id").populate("items.product_id");

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET ALL Purchase Transactions
exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ is_active: 1 })
      .populate("vendor_id", "v_name v_contact")
      .populate("items.product_id", "p_name p_price")
      .sort({ purchase_date: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET SINGLE Purchase Transaction
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("vendor_id")
      .populate("items.product_id");

    if (!purchase || purchase.is_active !== 1) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET Purchases by Vendor
exports.getPurchasesByVendor = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      vendor_id: req.params.vendor_id,
      is_active: 1
    })
      .populate("vendor_id", "v_name v_contact")
      .populate("items.product_id", "p_name p_price")
      .sort({ purchase_date: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE Purchase Transaction
exports.updatePurchase = async (req, res) => {
  try {
    const { items, vendor_id, purchase_date, gst_percent = 0, round_off_amt = 0 } = req.body;

    // Validate vendor if being updated
    if (vendor_id) {
      const vendor = await Vendor.findById(vendor_id);
      if (!vendor || vendor.is_active !== 1) {
        return res.status(404).json({ message: "Vendor not found" });
      }
    }

    let updateData = { vendor_id, purchase_date, gst_percent, round_off_amt };
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
      const purchase = await Purchase.findById(req.params.id);
      if (purchase) {
        const { gstAmount, finalAmount } = calculateAmounts(purchase.total_amount, gst_percent, round_off_amt);
        updateData.gst_amount = gstAmount;
        updateData.final_amount = finalAmount;
      }
    }

    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("vendor_id")
      .populate("items.product_id");

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE Purchase Transaction (Soft Delete)
exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { is_active: 0 },
      { new: true }
    );

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
