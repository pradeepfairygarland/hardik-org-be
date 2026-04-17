const express = require("express");
const router = express.Router();

const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
} = require("../controllers/vendorController");

const protect = require("../middleware/authMiddleware");

// ✅ CREATE
router.post("/addNew", protect, createVendor);

// ✅ READ ALL
router.get("/vendorList", protect, getVendors);

// ✅ READ ONE
router.get("/get/:id", protect, getVendorById);

// ✅ UPDATE
router.put("/update/:id", protect, updateVendor);

// ✅ DELETE
router.delete("/delete/:id", protect, deleteVendor);

module.exports = router;