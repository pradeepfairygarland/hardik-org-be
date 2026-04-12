const express = require("express");
const router = express.Router();

const {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor
} = require("../controllers/vendorController");


const protect = require("../middleware/authMiddleware");


// CREATE
router.post("/", protect, createVendor);

// READ ALL
router.get("/", protect, getVendors);

// UPDATE
router.put("/:id", protect, updateVendor);

// DELETE
router.delete("/:id", protect, deleteVendor);

module.exports = router;