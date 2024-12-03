<?php

// Enable CORS for cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the requested path
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Route the request
if ($requestUri === '/designer' && $requestMethod === 'POST') {
    // Process the '/designer' route
    try {
        // Capture incoming POST data
        $data = $_POST;

        // Handle file uploads if any
        $uploadedFiles = [];
        if (isset($_FILES)) {
            foreach ($_FILES as $key => $file) {
                $uploadedFiles[$key] = [
                    "name" => $file['name'],
                    "type" => $file['type'],
                    "size" => $file['size']
                ];
            }
        }

        // Prepare response
        $response = [
            "status" => "success",
            "message" => "Data received successfully.",
            "data" => $data,
            "files" => $uploadedFiles
        ];

        // Send response
        echo json_encode($response);
    } catch (Exception $e) {
        // Handle errors
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    // Handle unknown routes
    http_response_code(404);
    echo json_encode(["error" => "Endpoint not found."]);
}
