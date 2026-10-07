<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../models/Product.php";

$method = $_SERVER["REQUEST_METHOD"];
$productModel = new Product();

if ($method === "GET") {
    $products = $productModel->getAll();
    http_response_code(200);
    echo json_encode($products);
    exit;
}

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["name"]) || !isset($data["category"]) || empty(trim($data["name"]))) {
        http_response_code(400);
        echo json_encode(["error" => "Required fields are missing."]);
        exit;
    }

    $success = $productModel->create(
        $data["name"],
        $data["category"],
        $data["costPrice"] ?? 0,
        $data["salePrice"] ?? 0,
        $data["unit"] ?? 'unidades',
        $data["currentStock"] ?? 0,
        $data["minimumStock"] ?? 5
    );

    if ($success) {
        http_response_code(201);
        echo json_encode(["message" => "Product saved successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save product due to server error."]);
    }
    exit;
}

http_response_code(405); 
echo json_encode(["error" => "Method not allowed."]);
exit;
?>
