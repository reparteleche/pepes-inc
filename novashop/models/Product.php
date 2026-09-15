<?php
require_once __DIR__ . "/../config/Database.php";

class Product {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll() {
        try {
            $sql = "SELECT id, name, category, cost_price, sale_price, unit, current_stock, minimum_stock 
                    FROM products ORDER BY id DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getAll products: " . $e->getMessage());
            return [];
        }
    }

    public function create($name, $category, $costPrice, $salePrice, $unit, $currentStock, $minimumStock) {
        try {
            $name = htmlspecialchars(strip_tags($name));
            $category = htmlspecialchars(strip_tags($category));

            $sql = "INSERT INTO products 
                    (name, category, cost_price, sale_price, unit, current_stock, minimum_stock)
                    VALUES 
                    (:name, :category, :costPrice, :salePrice, :unit, :currentStock, :minimumStock)";

            $stmt = $this->db->prepare($sql);

            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":category", $category);
            $stmt->bindParam(":costPrice", $costPrice);
            $stmt->bindParam(":salePrice", $salePrice);
            $stmt->bindParam(":unit", $unit);
            $stmt->bindParam(":currentStock", $currentStock, PDO::PARAM_INT);
            $stmt->bindParam(":minimumStock", $minimumStock, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in create product: " . $e->getMessage());
            return false;
        }
    }
}
?>
