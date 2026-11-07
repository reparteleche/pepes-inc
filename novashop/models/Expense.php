<?php

require_once __DIR__ . "/../config/database.php";

class Expense {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll() {
        try {
            $sql = "SELECT category, description, amount, date FROM expenses ORDER BY date DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getAll expenses: " . $e->getMessage());
            return [];
        }
    }

    public function create($category, $description, $amount, $date) {
        try {
            $category = htmlspecialchars(strip_tags($category));
            $description = htmlspecialchars(strip_tags($description));

            $sql = "INSERT INTO expenses (category, description, amount, date) 
                    VALUES (:category, :description, :amount, :date)";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(":category", $category);
            $stmt->bindParam(":description", $description);
            $stmt->bindParam(":amount", $amount);
            $stmt->bindParam(":date", $date);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in create expense model: " . $e->getMessage());
            return false;
        }
    }
}
?>
