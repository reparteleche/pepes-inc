const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const rol = document.getElementById("rol").value;

        const mensaje = document.getElementById("mensaje");

        if (email === "" || password === "" || rol === "") {

            mensaje.textContent = "Complete todos los campos.";
            return;
        }

        if (
            email === "admin@gmail.com" &&
            password === "1234" &&
            rol === "Administrador"
        ) {

            window.location.href = "dashboard.html";
            return;
        }

        if (
            email === "vendedor@gmail.com" &&
            password === "1234" &&
            rol === "Vendedor"
        ) {

            window.location.href = "operaciones.html";
            return;
        }

        mensaje.textContent = "Usuario o contraseña incorrectos.";

    });

}
//in
const productoForm = document.getElementById("productoForm");

if (productoForm) {

    let productos = JSON.parse(localStorage.getItem("productos"));

    if (!productos) {

        productos = [
            {
                nombre: "Yerba Canarias",
                categoria: "Alimentos",
                stock: 20,
                precioVenta: 250
            },
            {
                nombre: "Arroz",
                categoria: "Alimentos",
                stock: 15,
                precioVenta: 90
            },
            {
                nombre: "Azúcar",
                categoria: "Alimentos",
                stock: 10,
                precioVenta: 75
            }
        ];

        localStorage.setItem("productos", JSON.stringify(productos));
    }

    mostrarProductos();

    productoForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const categoria = document.getElementById("categoria").value.trim();
        const costo = Number(document.getElementById("precioCosto").value);
        const venta = Number(document.getElementById("precioVenta").value);
        const stock = Number(document.getElementById("stockActual").value);

        if (nombre === "" || categoria === "") {

            alert("Complete todos los campos.");
            return;
        }

        if (venta <= costo) {

            alert("El precio de venta debe ser mayor que el precio costo.");
            return;
        }

        const existe = productos.some(function(prod){
            return prod.nombre.toLowerCase() === nombre.toLowerCase();
        });

        if (existe) {

            alert("Ese producto ya existe.");
            return;
        }

        productos.push({
            nombre: nombre,
            categoria: categoria,
            stock: stock,
            precioVenta: venta
        });

        localStorage.setItem("productos", JSON.stringify(productos));

        mostrarProductos();

        productoForm.reset();

        alert("Producto registrado correctamente.");

    });

    function mostrarProductos() {

        const tabla = document.getElementById("tablaProductos");

        tabla.innerHTML = "";

        productos.forEach(function(prod){

            tabla.innerHTML += `
                <tr>
                    <td>${prod.nombre}</td>
                    <td>${prod.categoria}</td>
                    <td>${prod.stock}</td>
                    <td>$${prod.precioVenta}</td>
                </tr>
            `;

        });

    }

}
//op ventas
const ventaForm = document.getElementById("ventaForm");

if (ventaForm) {

    const selectProducto = document.getElementById("productoVenta");
    const resultadoVenta = document.getElementById("resultadoVenta");

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    //select
    selectProducto.innerHTML = "";

    productos.forEach(function (producto) {

        let opcion = document.createElement("option");
        opcion.value = producto.nombre;
        opcion.textContent = producto.nombre;

        selectProducto.appendChild(opcion);

    });

    //
    document.getElementById("calcularVenta").addEventListener("click", function () {

        const cantidad = Number(document.getElementById("cantidad").value);
        const precio = Number(document.getElementById("precio").value);

        if (cantidad <= 0 || precio <= 0) {

            alert("Ingrese valores válidos.");
            return;

        }

        const total = cantidad * precio;

        resultadoVenta.textContent = "Total: $" + total;

    });

    //segir con ventas
    ventaForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const producto = selectProducto.value;
        const cantidad = Number(document.getElementById("cantidad").value);
        const precio = Number(document.getElementById("precio").value);
        const canal = document.getElementById("canalVenta").value;

        if (cantidad <= 0 || precio <= 0) {

            alert("Ingrese valores válidos.");
            return;

        }

        const total = cantidad * precio;

        ventas.push({
            producto: producto,
            cantidad: cantidad,
            precio: precio,
            canal: canal,
            total: total
        });

        localStorage.setItem("ventas", JSON.stringify(ventas));

        alert("Venta registrada correctamente.");

        ventaForm.reset();

        resultadoVenta.textContent = "Total: $0";

    });

}
//op gastos
const gastoForm = document.getElementById("gastoForm");

if (gastoForm) {

    let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    mostrarGastos();

    gastoForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const categoria = document.getElementById("categoriaGasto").value.trim();
        const descripcion = document.getElementById("descripcionGasto").value.trim();
        const monto = Number(document.getElementById("montoGasto").value);
        const fecha = document.getElementById("fechaGasto").value;

        if (categoria === "" || descripcion === "" || monto <= 0 || fecha === "") {

            alert("Complete todos los campos.");
            return;

        }

        gastos.push({
            categoria: categoria,
            descripcion: descripcion,
            monto: monto,
            fecha: fecha
        });

        localStorage.setItem("gastos", JSON.stringify(gastos));

        mostrarGastos();

        gastoForm.reset();

        alert("Gasto registrado correctamente.");

    });

    function mostrarGastos() {

        const tabla = document.getElementById("tablaGastos");

        tabla.innerHTML = "";

        gastos.forEach(function (gasto) {

            tabla.innerHTML += `
                <tr>
                    <td>${gasto.categoria}</td>
                    <td>${gasto.descripcion}</td>
                    <td>$${gasto.monto}</td>
                    <td>${gasto.fecha}</td>
                </tr>
            `;

        });

    }

}
//repo
const botonReporte = document.getElementById("generarReporte");

if (botonReporte) {

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    document.getElementById("totalProductos").textContent =
        "Total de productos registrados: " + productos.length;

    let totalVentas = 0;

    ventas.forEach(function (venta) {

        totalVentas += venta.total;

    });

    document.getElementById("totalVentas").textContent =
        "Total de ventas: $" + totalVentas;

    let totalGastos = 0;

    gastos.forEach(function (gasto) {

        totalGastos += gasto.monto;

    });

    document.getElementById("totalGastos").textContent =
        "Total de gastos: $" + totalGastos;

    let stockBajo = 0;

    productos.forEach(function (producto) {

        if (producto.stock <= 5) {

            stockBajo++;

        }

    });

    document.getElementById("stockBajo").textContent =
        "Productos con stock bajo: " + stockBajo;

    botonReporte.addEventListener("click", function () {

        const tipo = document.getElementById("tipoReporte").value;
        const resultado = document.getElementById("resultadoReporte");

        resultado.innerHTML = "";

        if (tipo === "Inventario") {

            productos.forEach(function (producto) {

                resultado.innerHTML +=
                "<p>" +
                producto.nombre +
                " | Stock: " +
                producto.stock +
                " | $" +
                producto.precioVenta +
                "</p>";

            });

        }

        if (tipo === "Ventas") {

            ventas.forEach(function (venta) {

                resultado.innerHTML +=
                "<p>" +
                venta.producto +
                " | Cantidad: " +
                venta.cantidad +
                " | Total: $" +
                venta.total +
                "</p>";

            });

        }

        if (tipo === "Gastos") {

            gastos.forEach(function (gasto) {

                resultado.innerHTML +=
                "<p>" +
                gasto.categoria +
                " | $" +
                gasto.monto +
                " | " +
                gasto.fecha +
                "</p>";

            });

        }

    });

}
//menu
const dashboardProductos = document.getElementById("dashboardProductos");

if (dashboardProductos) {

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    document.getElementById("dashboardProductos").textContent =
        productos.length + " registrados";

    document.getElementById("dashboardVentas").textContent =
        ventas.length + " realizadas";

    document.getElementById("dashboardGastos").textContent =
        gastos.length + " registrados";

    let alertas = 0;

    productos.forEach(function (producto) {

        if (producto.stock <= 5) {

            alertas++;

        }

    });

    document.getElementById("dashboardAlertas").textContent =
        alertas + " pendientes";

}