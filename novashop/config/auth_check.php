<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function checkAccess($allowedRole) {
    if (!isset($_SESSION["user_role"])) {
        header("Location: index.html");
        exit;
    }

    if ($_SESSION["user_role"] !== $allowedRole) {
        if ($_SESSION["user_role"] === "Vendedor") {
            header("Location: operaciones.php");
        } else {
            header("Location: dashboard.php");
        }
        exit;
    }
}
?>
