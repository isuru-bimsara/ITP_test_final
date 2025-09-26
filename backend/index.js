// backend/index.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const orderRoutes = require("./routes/orderRoutes");

// Initialize Express App
const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API Routes ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/faqs", require("./routes/faqRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));

app.use("/api/orders", orderRoutes);

// Employee routes
app.use("/api/employees", require("./routes/employee.route"));

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
