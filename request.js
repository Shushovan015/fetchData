const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));  // Allow all domains (replace with specific domain in production)

// Handle CORS preflight (OPTIONS)
app.options("*", cors());

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create unique filenames
  },
});
const upload = multer({ storage });

// Create an "uploads" directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// POST route to handle the payload and file uploads
app.post("/designer", upload.fields([{ name: "images" }, { name: "pdfs" }]), (req, res) => {
  // Log the received payload and files for debugging
  console.log("Received payload:", req.body);
  console.log("Uploaded files:", req.files);

  // Extract payload data
  const { lineItems, product_id, product_number, shop_url, product_name, brand_name } = req.body;

  // Extract file paths
  const imageFiles = req.files.images ? req.files.images.map((file) => file.path) : [];
  const pdfFiles = req.files.pdfs ? req.files.pdfs.map((file) => file.path) : [];

  // Mimic processing and send a response
  if (!lineItems || !product_id || !product_number) {
    return res.status(400).json({ status: "error", message: "Invalid payload" });
  }

  const response = {
    status: "success",
    message: "Payload and files received successfully.",
    receivedData: {
      lineItems,
      product_id,
      product_number,
      shop_url,
      product_name,
      brand_name,
      images: imageFiles,
      pdfs: pdfFiles,
    },
  };

  res.status(200).json(response);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
