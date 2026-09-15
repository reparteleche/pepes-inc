<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../models/Sale.php";

$method = $_SERVER["REQUEST_METHOD"];
$saleModel = new Sale();

if ($method !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$productName = isset($data["productName"]) ? trim($data["productName"]) : "";
$quantity = isset($data["quantity"]) ? intval($data["quantity"]) : 0;
$price = isset($data["price"]) ? floatval($data["price"]) : 0;
$channel = isset($data["channel"]) ? trim($data["channel"]) : "";

if (empty($productName) || $quantity <= 0 || $price <= 0 || empty($channel)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid sale data. Please check fields."]);
    exit;
}
$total = $quantity * $price;

$success = $saleModel->create($productName, $quantity, $price, $channel, $total);

if ($success) {
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Sale registered successfully in XAMPP.",
        "total" => $total
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to record sale on database."]);
}
exit;
?>
