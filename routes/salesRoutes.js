const express = require("express");
const router = express.Router();

const {
  createSale,
  getSales,
  getSaleById,
  getSalesByCustomer,
  updateSale,
  deleteSale
} = require("../controllers/salesController");

const protect = require("../middleware/authMiddleware");

// CREATE
router.post("/addNew", protect, createSale);

// READ ALL
router.get("/salesList", protect, getSales);

// READ ONE
router.get("/get/:id", protect, getSaleById);

// READ BY CUSTOMER
router.get("/customer/:customer_id", protect, getSalesByCustomer);

// UPDATE
router.put("/update/:id", protect, updateSale);

// DELETE
router.delete("/delete/:id", protect, deleteSale);

module.exports = router;
