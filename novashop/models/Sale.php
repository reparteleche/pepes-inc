<?php
require_once __DIR__ . "/../config/database.php";

class Sale {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll() {
        try {
            $sql = "SELECT product_name, quantity, price, channel, total FROM sales";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getAll sales: " . $e->getMessage());
            return [];
        }
    }

    public function create($productName, $quantity, $price, $channel, $total) {
        try {
            // Nombre tal como llega del selector (igual al guardado en products)
            $productoBuscado = $productName;

            $productName = htmlspecialchars(strip_tags($productName));
            $channel = htmlspecialchars(strip_tags($channel));

            $this->db->beginTransaction();

            // Descuenta el stock solo si alcanza (RF6)
            $sqlStock = "UPDATE products
                         SET current_stock = current_stock - :quantity
                         WHERE name = :name AND current_stock >= :quantity2";
            $stmtStock = $this->db->prepare($sqlStock);
            $stmtStock->bindParam(":quantity", $quantity, PDO::PARAM_INT);
            $stmtStock->bindParam(":quantity2", $quantity, PDO::PARAM_INT);
            $stmtStock->bindParam(":name", $productoBuscado);
            $stmtStock->execute();

            if ($stmtStock->rowCount() === 0) {
                $this->db->rollBack();
                return "stock_insuficiente";
            }

            $sql = "INSERT INTO sales (product_name, quantity, price, channel, total)
                    VALUES (:productName, :quantity, :price, :channel, :total)";

            $stmt = $this->db->prepare($sql);

            $stmt->bindParam(":productName", $productName);
            $stmt->bindParam(":quantity", $quantity, PDO::PARAM_INT);
            $stmt->bindParam(":price", $price);
            $stmt->bindParam(":channel", $channel);
            $stmt->bindParam(":total", $total);

            $stmt->execute();
            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            error_log("Error in create sale model: " . $e->getMessage());
            return false;
        }
    }
}
?>
