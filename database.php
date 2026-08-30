<?php

function getConexion() {

    $host = "localhost";
    $usuario = "root";
    $password = "";
    $baseDatos = "novashop";

    try {

        $conexion = new PDO(
            "mysql:host=$host;dbname=$baseDatos;charset=utf8",
            $usuario,
            $password
        );

        $conexion->setAttribute(
            PDO::ATTR_ERRMODE,
            PDO::ERRMODE_EXCEPTION
        );

        return $conexion;

    } catch (PDOException $e) {

        die("Error de conexion: " . $e->getMessage());

    }
}
?>