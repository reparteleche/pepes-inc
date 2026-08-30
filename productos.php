<?php

require_once "../config/database.php";

header("Content-Type: application/json");

$conexion = getConexion();

$metodo = $_SERVER["REQUEST_METHOD"];

if ($metodo == "GET") {

    $sql = "SELECT * FROM productos ORDER BY id DESC";

    $stmt = $conexion->prepare($sql);
    $stmt->execute();

    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($productos);

}

if ($metodo == "POST") {

    $datos = json_decode(file_get_contents("php://input"), true);

    $nombre = $datos["nombre"];
    $categoria = $datos["categoria"];
    $precioCosto = $datos["precioCosto"];
    $precioVenta = $datos["precioVenta"];
    $unidad = $datos["unidad"];
    $stockActual = $datos["stockActual"];
    $stockMinimo = $datos["stockMinimo"];

    $sql = "INSERT INTO productos
            (nombre, categoria, precio_costo, precio_venta, unidad, stock_actual, stock_minimo)
            VALUES
            (:nombre, :categoria, :precioCosto, :precioVenta, :unidad, :stockActual, :stockMinimo)";

    $stmt = $conexion->prepare($sql);

    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":categoria", $categoria);
    $stmt->bindParam(":precioCosto", $precioCosto);
    $stmt->bindParam(":precioVenta", $precioVenta);
    $stmt->bindParam(":unidad", $unidad);
    $stmt->bindParam(":stockActual", $stockActual);
    $stmt->bindParam(":stockMinimo", $stockMinimo);

    $stmt->execute();

    echo json_encode([
        "mensaje" => "Producto guardado correctamente"
    ]);
}
?>