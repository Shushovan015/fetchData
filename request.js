const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors({ origin: "https://github.com/Shushovan015/fetchData/designer" })); // Update with specific allowed origin
app.use(express.json()); // Parse JSON payload
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payload

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
  try {
    // Log the received payload and files for debugging
    console.log("Received payload:", req.body);
    console.log("Uploaded files:", req.files);

    // Extract payload data (handle missing fields gracefully)
    const {
      lineItems = null,
      product_id = null,
      product_number = null,
      shop_url = null,
      product_name = null,
      brand_name = null,
    } = req.body;

    // Extract file paths (handle empty files gracefully)
    const imageFiles = req.files?.images?.map((file) => file.path) || [];
    const pdfFiles = req.files?.pdfs?.map((file) => file.path) || [];

    // Respond with the received data, even if optional fields are missing
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
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request.",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
