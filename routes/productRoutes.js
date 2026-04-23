const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

// ✅ CREATE
router.post("/addNew", protect, createProduct);

// ✅ READ ALL
router.get("/productList", protect, getProducts);

// ✅ READ ONE
router.get("/get/:id", protect, getProductById);

// ✅ UPDATE
router.put("/update/:id", protect, updateProduct);

// ✅ DELETE
router.delete("/delete/:id", protect, deleteProduct);

module.exports = router;
