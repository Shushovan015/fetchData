const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(
  cors({
    // origin: ["http://localhost:3000", "https://api.fm24api.com"], // Replace with your frontend's domain
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow required HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payload

// Multer setup for handling file uploads (Memory Storage)
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// POST route to handle the payload and file uploads
app.post(
  "/designer",
  upload.fields([{ name: "images" }, { name: "pdfs" }]),
  (req, res) => {
    try {
      // Log the received payload and files for debugging
      console.log("Received payload:", req.body);
      console.log("Uploaded files:", req.files);

      const {
        lineItems = null,
        product_id = null,
        product_number = null,
        shop_url = null,
        product_name = null,
        brand_name = null,
      } = req.body;

      // Extract file buffers (in memory)
      const imageFiles =
        req.files?.images?.map((file) => ({
          originalName: file.originalname,
          buffer: file.buffer,
          mimetype: file.mimetype,
        })) || [];
      const pdfFiles =
        req.files?.pdfs?.map((file) => ({
          originalName: file.originalname,
          buffer: file.buffer,
          mimetype: file.mimetype,
        })) || [];

      // Log the file details for debugging (no files saved to disk)
      console.log("Images:", imageFiles);
      console.log("PDFs:", pdfFiles);

      // Respond with the received data
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
          // images: imageFiles.map((file) => file.originalName), // Include file names
          // pdfs: pdfFiles.map((file) => file.originalName), // Include file names
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
  }
);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
