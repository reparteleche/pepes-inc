<?php
// config/Database.php

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        $host = "localhost";
        $usuario = "root";
        $password = "";
        $baseDatos = "stockflow";

        try {
            $this->conn = new PDO(
                "mysql:host=$host;dbname=$baseDatos;charset=utf8",
                $usuario,
                $password
            );

            $this->conn->setAttribute(
                PDO::ATTR_ERRMODE,
                PDO::ERRMODE_EXCEPTION
            );
        } catch (PDOException $e) {
            error_log("Error de conexion: " . $e->getMessage());
            die("Internal Server Error.");
        }
    }

    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->conn;
    }
}
?>
