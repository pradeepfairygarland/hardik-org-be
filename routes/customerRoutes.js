const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

const protect = require("../middleware/authMiddleware");

// ✅ CREATE
router.post("/addNew", protect, createCustomer);

// ✅ READ ALL
router.get("/customerList", protect, getCustomers);

// ✅ READ ONE
router.get("/get/:id", protect, getCustomerById);

// ✅ UPDATE
router.put("/update/:id", protect, updateCustomer);

// ✅ DELETE
router.delete("/delete/:id", protect, deleteCustomer);

module.exports = router;