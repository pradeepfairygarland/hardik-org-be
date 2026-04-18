const Customer = require("../models/Customer");


// ✅ CREATE
exports.createCustomer = async (req, res) => {
  try {
    const { c_name, c_contact } = req.body;

    if (!c_name || !c_contact) {
      return res.status(400).json({
        message: "c_name and c_contact are required"
      });
    }

    const customer = await Customer.create(req.body);

    res.status(201).json(customer);

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Customer name already exists"
      });
    }

    res.status(500).json({ error: error.message });
  }
};


// ✅ GET ALL
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ GET ONE
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ UPDATE
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ DELETE
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};