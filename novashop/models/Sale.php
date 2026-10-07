<?php
require_once __DIR__ . "/../config/Database.php";

class Sale {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($productName, $quantity, $price, $channel, $total) {
        try {
            $productName = htmlspecialchars(strip_tags($productName));
            $channel = htmlspecialchars(strip_tags($channel));

            $sql = "INSERT INTO sales (product_name, quantity, price, channel, total) 
                    VALUES (:productName, :quantity, :price, :channel, :total)";
            
            $stmt = $this->db->prepare($sql);

            $stmt->bindParam(":productName", $productName);
            $stmt->bindParam(":quantity", $quantity, PDO::PARAM_INT);
            $stmt->bindParam(":price", $price);
            $stmt->bindParam(":channel", $channel);
            $stmt->bindParam(":total", $total);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in create sale model: " . $e->getMessage());
            return false;
        }
    }
}
?>
