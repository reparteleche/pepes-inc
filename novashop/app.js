
const loginForm = document.getElementById("loginForm");


if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value;
        const mensaje = document.getElementById("mensaje");

        if (email === "" || password === "" || role === "") {
            mensaje.textContent = "Complete todos los campos.";
            return;
        }

        const loginData = { email: email, password: password, role: role };

        fetch("api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        })
            .then(function (response) {
                if (!response.ok && response.status !== 401 && response.status !== 400) {
                    throw new Error("Server communication fault.");
                }
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    if (data.role === "Administrador") {
                        window.location.href = "Dashboard.php";
                    } else if (data.role === "Vendedor") {
                        window.location.href = "Operaciones.php";
                    }
                } else {
                    mensaje.textContent = data.error || "Usuario o contraseña incorrectos.";
                }
            })
            .catch(function (error) {
                console.error("Fetch network fault:", error);
                mensaje.textContent = "Error de conexión con el servidor XAMPP.";
            });
    });
}


const productoForm = document.getElementById("productoForm");

if (productoForm) {
    cargarProductosBD();

    productoForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const categoria = document.getElementById("categoria").value.trim();
        const costo = Number(document.getElementById("precioCosto").value);
        const venta = Number(document.getElementById("precioVenta").value);
        const unidad = document.getElementById("unidad").value.trim();
        const stockActual = Number(document.getElementById("stockActual").value);
        const stockMinimo = Number(document.getElementById("stockMinimo").value);

        if (nombre === "" || categoria === "") {
            alert("Complete todos los campos obligatorios.");
            return;
        }

        if (venta <= costo) {
            alert("El precio de venta debe ser mayor que el precio costo.");
            return;
        }

        const productoData = {
            name: nombre,
            category: categoria,
            costPrice: costo,
            salePrice: venta,
            unit: unidad || "unidades",
            currentStock: stockActual,
            minimumStock: stockMinimo
        };

        fetch("api/products.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productoData)
        })
            .then(function (response) {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || "Error de servidor"); });
                }
                return response.json();
            })
            .then(function (data) {
                alert("¡Producto guardado con éxito en MySQL!");
                productoForm.reset();
                cargarProductosBD();
            })
            .catch(function (error) {
                console.error("Error al insertar:", error);
                alert("Error de persistencia: " + error.message);
            });
    });

    function cargarProductosBD() {
        fetch("api/products.php")
            .then(response => {
                if (!response.ok) throw new Error("Error cargando productos.");
                return response.json();
            })
            .then(productosBD => {
                mostrarProductos(productosBD);
            })
            .catch(error => console.error("Error Fetch GET productos:", error));
    }

    function mostrarProductos(listaProductos) {
        const tabla = document.getElementById("tablaProductos");
        tabla.innerHTML = "";

        listaProductos.forEach(function (prod) {
            tabla.innerHTML += `
                <tr>
                    <td><strong>${prod.name}</strong></td>
                    <td>${prod.category}</td>
                    <td>${prod.current_stock} ${prod.unit || 'unidades'}</td>
                    <td>$${Number(prod.sale_price).toFixed(2)}</td>
                </tr>
            `;
        });
    }
}

const ventaForm = document.getElementById("ventaForm");

if (ventaForm) {
    const selectProducto = document.getElementById("productoVenta");
    const resultadoVenta = document.getElementById("resultadoVenta");

    selectProducto.innerHTML = "";

    fetch("api/products.php")
        .then(response => response.json())
        .then(productosBD => {
            productosBD.forEach(function (producto) {
                let opcion = document.createElement("option");
                opcion.value = producto.name;
                opcion.textContent = producto.name;
                selectProducto.appendChild(opcion);
            });
        })
        .catch(error => console.error("Error al cargar productos para venta:", error));

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

        const ventaData = {
            productName: producto,
            quantity: cantidad,
            price: precio,
            channel: canal
        };

        fetch("api/sales.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ventaData)
        })
            .then(function (response) {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || "Error en persistencia."); });
                }
                return response.json();
            })
            .then(function (data) {
                alert("Venta registrada correctamente en XAMPP.");
                ventaForm.reset();
                resultadoVenta.textContent = "Total: $0";
            })
            .catch(function (error) {
                console.error("Error Fetch POST ventas:", error);
                alert("Error al registrar la venta: " + error.message);
            });
    });
}


const gastoForm = document.getElementById("gastoForm");

if (gastoForm) {
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

        const gastoData = {
            category: categoria,
            description: descripcion,
            amount: monto,
            date: fecha
        };

        fetch("api/expenses.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gastoData)
        })
            .then(response => {
                if (!response.ok) throw new Error("Error al guardar gasto.");
                return response.json();
            })
            .then(data => {
                alert("Gasto registrado correctamente en XAMPP.");
                mostrarGastos();
                gastoForm.reset();
            })
            .catch(error => {
                console.error("Error Fetch POST gastos:", error);
                alert("Error de conexión al guardar el gasto.");
            });
    });

    function mostrarGastos() {
        const tabla = document.getElementById("tablaGastos");
        if (!tabla) return;

        fetch("api/expenses.php")
            .then(response => response.json())
            .then(gastosBD => {
                tabla.innerHTML = "";
                gastosBD.forEach(gasto => {
                    tabla.innerHTML += `
                    <tr>
                        <td>${gasto.category}</td>
                        <td>${gasto.description}</td>
                        <td>$${Number(gasto.amount).toFixed(2)}</td>
                        <td>${gasto.date}</td>
                    </tr>
                    `;
                });
            })
            .catch(error => console.error("Error al traer gastos:", error));
    }
}

const botonReporte = document.getElementById("generarReporte");
const dashboardProductos = document.getElementById("dashboardProductos");
if (botonReporte || dashboardProductos) {
    Promise.all([
        fetch("api/products.php").then(res => res.json()).catch(() => []),
        fetch("api/sales.php").then(res => res.json()).catch(() => []),
        fetch("api/expenses.php").then(res => res.json()).catch(() => [])
    ])
        .then(([productos, ventas, gastos]) => {
            if (dashboardProductos) {
                document.getElementById("dashboardProductos").textContent = productos.length + " registrados";
                document.getElementById("dashboardVentas").textContent = ventas.length + " realizadas";
                document.getElementById("dashboardGastos").textContent = gastos.length + " registrados";
                let alertas = productos.filter(p => Number(p.current_stock) <= Number(p.minimum_stock)).length;
                document.getElementById("dashboardAlertas").textContent = alertas + " pendientes";
            }
            if (botonReporte) {
                document.getElementById("totalProductos").textContent = "Total de productos registrados: " + productos.length;
                let totalVentas = ventas.reduce((acc, v) => acc + (Number(v.quantity) * Number(v.price)), 0);
                document.getElementById("totalVentas").textContent = "Total de ventas: $" + totalVentas.toFixed(2);
                let totalGastos = gastos.reduce((acc, g) => acc + Number(g.amount), 0);
                document.getElementById("totalGastos").textContent = "Total de gastos: $" + totalGastos.toFixed(2);
                let stockBajo = productos.filter(p => Number(p.current_stock) <= Number(p.minimum_stock)).length;
                document.getElementById("stockBajo").textContent = "Productos con stock bajo: " + stockBajo;
                botonReporte.addEventListener("click", function () {
                    const tipo = document.getElementById("tipoReporte").value;
                    const resultado = document.getElementById("resultadoReporte");
                    resultado.innerHTML = "";
                    if (tipo === "Inventario") {
                        productos.forEach(p => {
                            resultado.innerHTML += `<p>${p.name} | Stock: ${p.current_stock} | $${p.sale_price}</p>`;
                        });
                    }
                    if (tipo === "Ventas") {
                        ventas.forEach(v => {
                            let totalV = Number(v.quantity) * Number(v.price);
                            resultado.innerHTML += `<p>${v.product_name || v.productName} | Cantidad: ${v.quantity} | Total: $${totalV}</p>`;
                        });
                    }
                    if (tipo === "Gastos") {
                        gastos.forEach(g => {
                            resultado.innerHTML += `<p>${g.category} | $${g.amount} | ${g.date}</p>`;
                        });
                    }
                });
            }
        })
        .catch(err => console.error("Error al procesar métricas del servidor:", err));
}