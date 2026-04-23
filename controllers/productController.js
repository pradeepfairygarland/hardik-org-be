const Product = require("../models/Product");


// ✅ CREATE Product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    // ✅ Handle duplicate error cleanly
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Product name already exists"
      });
    }
    
    res.status(500).json({ error: error.message });
  }
};


// ✅ GET ALL Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ is_active: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ GET SINGLE Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.is_active !== 1) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ UPDATE Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    // ✅ Handle duplicate error cleanly
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Product name already exists"
      });
    }

    res.status(500).json({ error: error.message });
  }
};


// ✅ DELETE Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { is_active: 0 },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
