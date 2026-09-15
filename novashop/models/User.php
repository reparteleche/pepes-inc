<?php
require_once __DIR__ . "/../config/Database.php";

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function login($email, $password, $role) {
        try {
            $sql = "SELECT id, email, password, role FROM users WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(":email", $email);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
            if (md5($password) === $user['password'] || $password === $user['password']) {
            if ($user['role'] === $role) {
                    return $user;
                    }
                }
            }
            
            return false;
        } catch (PDOException $e) {
            error_log("Login model error: " . $e->getMessage());
            return false;
        }
    }
}
?>
