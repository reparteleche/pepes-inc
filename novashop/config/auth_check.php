<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function checkAccess($allowedRoles) {
    if (!isset($_SESSION["user_role"])) {
        header("Location: index.html");
        exit;
    }
    
    $rolesPermitidos = is_array($allowedRoles) ? $allowedRoles : [$allowedRoles];

    if (!in_array($_SESSION["user_role"], $rolesPermitidos)) {
        if ($_SESSION["user_role"] === "Vendedor") {
            header("Location: Operaciones.php");
        } else {
            header("Location: Dashboard.php");
        }
        exit;
    }
}