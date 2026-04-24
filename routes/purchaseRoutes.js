const express = require("express");
const router = express.Router();

const {
  createPurchase,
  getPurchases,
  getPurchaseById,
  getPurchasesByVendor,
  updatePurchase,
  deletePurchase
} = require("../controllers/purchaseController");

const protect = require("../middleware/authMiddleware");

// ✅ CREATE
router.post("/addNew", protect, createPurchase);

// ✅ READ ALL
router.get("/purchaseList", protect, getPurchases);

// ✅ READ ONE
router.get("/get/:id", protect, getPurchaseById);

// ✅ READ BY VENDOR
router.get("/vendor/:vendor_id", protect, getPurchasesByVendor);

// ✅ UPDATE
router.put("/update/:id", protect, updatePurchase);

// ✅ DELETE
router.delete("/delete/:id", protect, deletePurchase);

module.exports = router;
