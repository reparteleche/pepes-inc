<?php require_once "config/auth_check.php"; checkAccess("Administrador"); ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - NovaShop</title>
    <link rel="stylesheet" href="estilos.css?v=3.0">
</head>
<body>

<header>
    <h1>NovaShop</h1>
    <h2>Panel de Administración</h2>
</header>

<nav>
    <a href="dashboard.php">Dashboard</a>
    <a href="inventario.php">Inventario</a>
    <a href="operaciones.php">Operaciones</a>
    <a href="reportes.php">Reportes</a>
</nav>

<main>

    <h2>Panel Principal</h2>

    <div class="Cards">
        <div class="card">
            <h3>Productos</h3>
            <p id="dashboardProductos">Cargando...</p>
        </div>

        <div class="card">
            <h3>Ventas</h3>
            <p id="dashboardVentas">Cargando...</p>
        </div>

        <div class="card">
            <h3>Gastos</h3>
            <p id="dashboardGastos">Cargando...</p>
        </div>

        <div class="card">
            <h3>Alertas</h3>
            <p id="dashboardAlertas">Cargando...</p>
        </div>
    </div>

    <section>
        <h2>Bienvenido al sistema</h2>
        <p>Desde este panel podrás acceder al inventario, registrar operaciones y consultar reportes operativos en tiempo real.</p>
    </section>

</main>

<footer>
    <p>NovaShop 2026 - Johan Ventresca - Bruno Silva - Mateo Mayero</p>
</footer>

<script src="app.js"></script>

</body>
</html>
