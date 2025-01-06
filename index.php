<?php

// Enable CORS for cross-origin requests
header("Access-Control-Allow-Origin: *");  // Allows all origins, adjust if needed for security
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");  // Specify allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");  // Specify allowed headers
header("Access-Control-Allow-Credentials: true");  // Allow credentials like cookies if needed

// Determine the request method
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Get the requested path
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Function to generate dynamic form fields based on data
function generateDynamicForm($data)
{
    $form = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Dynamic Designer Form</title>
</head>
<body>
    <h1>Dynamic Designer Submission Form</h1>
    <form action="/designer" method="POST" enctype="multipart/form-data">';

    foreach ($data as $key => $value) {
        $type = is_numeric($value) ? 'number' : 'text'; // Determine input type based on value
        $form .= '<div>
                    <label for="' . htmlspecialchars($key) . '">' . ucfirst($key) . ':</label><br>
                    <input type="' . $type . '" id="' . htmlspecialchars($key) . '" name="' . htmlspecialchars($key) . '" value="' . htmlspecialchars($value) . '" required>
                  </div><br>';
    }

    $form .= '<div>
                <label for="file">Upload File:</label><br>
                <input type="file" id="file" name="file">
              </div><br>
              <div>
                <button type="submit">Submit</button>
              </div>
          </form>
      </body>
  </html>';

    return $form;
}

// Route the request
if ($requestUri === '/designer') {
    if ($requestMethod === 'OPTIONS') {
        // Handle OPTIONS request for CORS preflight
        http_response_code(200);
        exit;
    } elseif ($requestMethod === 'POST') {
        // Set response content type to JSON for API responses
        header("Content-Type: application/json");

        try {
            // Capture incoming POST data
            $data = $_POST;

            // Handle file uploads if any
            $uploadedFiles = [];
            if (!empty($_FILES)) {
                foreach ($_FILES as $key => $file) {
                    if ($file['error'] === UPLOAD_ERR_OK) {
                        $uploadedFiles[$key] = [
                            "name" => $file['name'],
                            "type" => $file['type'],
                            "size" => $file['size'],
                        ];
                    } else {
                        $uploadedFiles[$key] = [
                            "error" => "File upload error code: " . $file['error']
                        ];
                    }
                }
            }

            // Generate dynamic form based on incoming data
            $htmlForm = generateDynamicForm($data);

            // Prepare response
            $response = [
                "status" => "success",
                "message" => "Data received successfully.",
                "data" => $data,
                "files" => $uploadedFiles,
                "form" => $htmlForm // Include the dynamically generated form in the response
            ];

            // Send response
            echo json_encode($response);
        } catch (Exception $e) {
            // Handle errors
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    } elseif ($requestMethod === 'GET') {
        // Serve a basic form for demonstration purposes
        header("Content-Type: text/html; charset=UTF-8");
        echo '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Designer Form</title>
</head>
<body>
    <h1>Designer Submission Form</h1>
    <form action="/designer" method="POST" enctype="multipart/form-data">
        <div>
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" required>
        </div><br>
        
        <div>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required>
        </div><br>
        
        <div>
            <label for="file">Upload File:</label><br>
            <input type="file" id="file" name="file">
        </div><br>
        
        <div>
            <button type="submit">Submit</button>
        </div>
    </form>
</body>
</html>';
    } else {
        // Method not allowed
        http_response_code(405);
        header("Content-Type: application/json");
        echo json_encode(["error" => "Method not allowed."]);
    }
} else {
    // Handle unknown routes
    http_response_code(404);
    header("Content-Type: application/json");
    echo json_encode(["error" => "Endpoint not found."]);
}
