const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running...");
});

connectDB();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});