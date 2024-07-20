// Packages used are defined here
import express from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Server configuration
const PORT = process.env.PORT || 5000;

// Server startup configuration
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
