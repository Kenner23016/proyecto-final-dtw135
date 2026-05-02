// Proyecto: Inventario básico de productos
// Avance 1 mejorado: estructura por vistas/páginas.
// Se mantiene el estilo de las prácticas: objeto app, eventos, DOM,
// arreglos, objetos, localStorage, sessionStorage y cookies.

const app = {
  productos: [],

  cargarProductos: function () {
    const datos = localStorage.getItem("productos");

    if (datos) {
      this.productos = JSON.parse(datos);
    }
  },

  guardarProductos: function () {
    localStorage.setItem("productos", JSON.stringify(this.productos));
  },

  agregarProducto: function (codigo, nombre, categoria, cantidad, precio) {
    const producto = {
      id: Date.now(),
      codigo: codigo,
      nombre: nombre,
      categoria: categoria,
      cantidad: Number(cantidad),
      precio: Number(precio)
    };

    this.productos.push(producto);
    this.guardarProductos();
    sessionStorage.setItem("ultimaAccion", "Producto agregado");
  },

  actualizarProducto: function (id, codigo, nombre, categoria, cantidad, precio) {
    this.productos = this.productos.map(function (producto) {
      if (producto.id === id) {
        producto.codigo = codigo;
        producto.nombre = nombre;
        producto.categoria = categoria;
        producto.cantidad = Number(cantidad);
        producto.precio = Number(precio);
      }

      return producto;
    });

    this.guardarProductos();
    sessionStorage.setItem("ultimaAccion", "Producto actualizado");
  },

  eliminarProducto: function (id) {
    this.productos = this.productos.filter(function (producto) {
      return producto.id !== id;
    });

    this.guardarProductos();
    sessionStorage.setItem("ultimaAccion", "Producto eliminado");
  },

  buscarProducto: function (id) {
    return this.productos.find(function (producto) {
      return producto.id === id;
    });
  },

  calcularTotalUnidades: function () {
    let total = 0;

    this.productos.forEach(function (producto) {
      total += producto.cantidad;
    });

    return total;
  },

  calcularValorInventario: function () {
    let total = 0;

    this.productos.forEach(function (producto) {
      total += producto.cantidad * producto.precio;
    });

    return total;
  }
};

// ===================== FUNCIONES DE PRODUCTOS =====================

function validarProducto(codigo, nombre, categoria, cantidad, precio) {
  if (!codigo.trim()) {
    mostrarMensajeFormulario("Ingrese el código del producto");
    return false;
  }

  if (!nombre.trim()) {
    mostrarMensajeFormulario("Ingrese el nombre del producto");
    return false;
  }

  if (!categoria.trim()) {
    mostrarMensajeFormulario("Seleccione una categoría");
    return false;
  }

  if (cantidad === "" || Number(cantidad) < 0 || isNaN(Number(cantidad))) {
    mostrarMensajeFormulario("Ingrese una cantidad válida");
    return false;
  }

  if (precio === "" || Number(precio) < 0 || isNaN(Number(precio))) {
    mostrarMensajeFormulario("Ingrese un precio válido");
    return false;
  }

  return true;
}

function obtenerEstadoProducto(cantidad) {
  if (cantidad === 0) {
    return "Agotado";
  }

  if (cantidad <= 5) {
    return "Stock bajo";
  }

  return "Disponible";
}

function obtenerClaseEstado(cantidad) {
  if (cantidad === 0) {
    return "agotado";
  }

  if (cantidad <= 5) {
    return "bajo";
  }

  return "";
}

function mostrarMensajeFormulario(texto) {
  const mensaje = document.getElementById("mensajeFormulario");

  if (mensaje) {
    mensaje.textContent = texto;
  }
}

function limpiarFormularioProducto() {
  document.getElementById("codigoInput").value = "";
  document.getElementById("productoInput").value = "";
  document.getElementById("categoriaInput").value = "";
  document.getElementById("cantidadInput").value = "";
  document.getElementById("precioInput").value = "";
  document.getElementById("contador").textContent = "0";
  mostrarMensajeFormulario("");
  sessionStorage.removeItem("productoEditando");
}

function cargarFormularioProducto() {
  const idEditando = Number(sessionStorage.getItem("productoEditando"));

  if (!idEditando) {
    return;
  }

  const producto = app.buscarProducto(idEditando);

  if (!producto) {
    sessionStorage.removeItem("productoEditando");
    return;
  }

  document.getElementById("tituloFormulario").textContent = "Editar producto";
  document.getElementById("guardarProductoBtn").textContent = "Actualizar producto";

  document.getElementById("codigoInput").value = producto.codigo;
  document.getElementById("productoInput").value = producto.nombre;
  document.getElementById("categoriaInput").value = producto.categoria;
  document.getElementById("cantidadInput").value = producto.cantidad;
  document.getElementById("precioInput").value = producto.precio;
  document.getElementById("contador").textContent = producto.nombre.length;
}

function guardarDesdeFormulario(evento) {
  evento.preventDefault();

  const codigo = document.getElementById("codigoInput").value;
  const nombre = document.getElementById("productoInput").value;
  const categoria = document.getElementById("categoriaInput").value;
  const cantidad = document.getElementById("cantidadInput").value;
  const precio = document.getElementById("precioInput").value;

  if (!validarProducto(codigo, nombre, categoria, cantidad, precio)) {
    return;
  }

  const idEditando = Number(sessionStorage.getItem("productoEditando"));

  if (idEditando) {
    app.actualizarProducto(idEditando, codigo, nombre, categoria, cantidad, precio);
    sessionStorage.removeItem("productoEditando");
  } else {
    app.agregarProducto(codigo, nombre, categoria, cantidad, precio);
  }

  window.location.href = "productos.html";
}

function renderTablaProductos(lista) {
  const tabla = document.getElementById("tablaProductos");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";

  if (lista.length === 0) {
    const fila = document.createElement("tr");
    const columna = document.createElement("td");
    columna.textContent = "No hay productos para mostrar";
    columna.colSpan = 8;
    columna.classList.add("sin-productos");
    fila.appendChild(columna);
    tabla.appendChild(fila);
    return;
  }

  lista.forEach(function (producto) {
    const fila = document.createElement("tr");
    const subtotal = producto.cantidad * producto.precio;
    const claseEstado = obtenerClaseEstado(producto.cantidad);

    fila.innerHTML = `
      <td>${producto.codigo}</td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>${producto.cantidad}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><span class="estado-stock ${claseEstado}">${obtenerEstadoProducto(producto.cantidad)}</span></td>
      <td>
        <div class="acciones-tabla">
          <button data-id="${producto.id}" class="editar">Editar</button>
          <button data-id="${producto.id}" class="eliminar secundario">Eliminar</button>
        </div>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

function filtrarProductos() {
  const busqueda = document.getElementById("buscarProducto").value.toLowerCase();

  const filtrados = app.productos.filter(function (producto) {
    return producto.nombre.toLowerCase().includes(busqueda) ||
           producto.codigo.toLowerCase().includes(busqueda);
  });

  renderTablaProductos(filtrados);
}

function renderUltimosProductos() {
  const tabla = document.getElementById("tablaUltimosProductos");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";

  const ultimos = app.productos.slice(-5).reverse();

  if (ultimos.length === 0) {
    const fila = document.createElement("tr");
    const columna = document.createElement("td");
    columna.textContent = "Aún no hay productos registrados";
    columna.colSpan = 4;
    columna.classList.add("sin-productos");
    fila.appendChild(columna);
    tabla.appendChild(fila);
    return;
  }

  ultimos.forEach(function (producto) {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${producto.codigo}</td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>${producto.cantidad}</td>
    `;

    tabla.appendChild(fila);
  });
}

function renderResumen() {
  const totalProductos = document.getElementById("totalProductos");
  const totalUnidades = document.getElementById("totalUnidades");
  const valorInventario = document.getElementById("valorInventario");

  if (totalProductos) {
    totalProductos.textContent = app.productos.length;
  }

  if (totalUnidades) {
    totalUnidades.textContent = app.calcularTotalUnidades();
  }

  if (valorInventario) {
    valorInventario.textContent = "$" + app.calcularValorInventario().toFixed(2);
  }
}

// ===================== COOKIES =====================

function guardarCookie() {
  const usuario = document.getElementById("usuarioInput").value;

  if (!usuario.trim()) {
    document.getElementById("mostrarUsuario").textContent = "Ingrese el nombre del encargado";
    return;
  }

  const fecha = new Date();
  fecha.setTime(fecha.getTime() + (7 * 24 * 60 * 60 * 1000));
  document.cookie = "usuario=" + usuario + "; expires=" + fecha.toUTCString() + "; path=/";

  mostrarCookie();
}

function obtenerCookie(nombre) {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const partes = cookie.trim().split("=");

    if (partes[0] === nombre) {
      return partes[1];
    }
  }

  return null;
}

function mostrarCookie() {
  const usuario = obtenerCookie("usuario");
  const mostrarUsuario = document.getElementById("mostrarUsuario");
  const nombreEncargado = document.getElementById("nombreEncargado");

  if (mostrarUsuario) {
    mostrarUsuario.textContent = usuario ? "Encargado guardado: " + usuario : "No hay encargado guardado";
  }

  if (nombreEncargado) {
    nombreEncargado.textContent = usuario ? usuario : "No registrado";
  }
}

// ===================== LOCAL STORAGE =====================

function cambiarTema() {
  const tema = localStorage.getItem("tema");

  if (tema === "dark") {
    localStorage.setItem("tema", "light");
    document.body.classList.remove("dark");
  } else {
    localStorage.setItem("tema", "dark");
    document.body.classList.add("dark");
  }
}

function cargarTema() {
  const tema = localStorage.getItem("tema");

  if (tema === "dark") {
    document.body.classList.add("dark");
  }
}

// ===================== SESSION STORAGE =====================

function iniciarSesion() {
  sessionStorage.setItem("sesion", "activa");
  mostrarSesion();
}

function cerrarSesion() {
  sessionStorage.removeItem("sesion");
  mostrarSesion();
}

function mostrarSesion() {
  const estado = sessionStorage.getItem("sesion");
  const estadoSesion = document.getElementById("estadoSesion");

  if (estadoSesion) {
    estadoSesion.textContent = estado ? "Sesión activa" : "Sesión cerrada";
  }
}

function mostrarUltimaAccion() {
  const accion = sessionStorage.getItem("ultimaAccion");
  const ultimaAccion = document.getElementById("ultimaAccion");

  if (ultimaAccion) {
    ultimaAccion.textContent = accion ? "Última acción: " + accion : "Sin acciones recientes";
  }
}

// ===================== EVENTOS POR VISTA =====================

function iniciarVistaInicio() {
  renderResumen();
  renderUltimosProductos();
  mostrarCookie();
  mostrarSesion();
}

function iniciarVistaProductos() {
  renderTablaProductos(app.productos);

  document.getElementById("buscarProducto").addEventListener("input", filtrarProductos);

  // Delegación de eventos en la tabla de productos.
  document.getElementById("tablaProductos").addEventListener("click", function (evento) {
    const id = Number(evento.target.dataset.id);

    if (evento.target.classList.contains("editar")) {
      sessionStorage.setItem("productoEditando", id);
      window.location.href = "producto-form.html";
    }

    if (evento.target.classList.contains("eliminar")) {
      app.eliminarProducto(id);
      renderTablaProductos(app.productos);
    }
  });
}

function iniciarVistaFormulario() {
  cargarFormularioProducto();

  document.getElementById("formProducto").addEventListener("submit", guardarDesdeFormulario);

  document.getElementById("limpiarBtn").addEventListener("click", limpiarFormularioProducto);

  document.getElementById("productoInput").addEventListener("input", function (evento) {
    document.getElementById("contador").textContent = evento.target.value.length;
  });
}

function iniciarVistaSesion() {
  mostrarCookie();
  mostrarSesion();
  mostrarUltimaAccion();

  document.getElementById("guardarUsuarioBtn").addEventListener("click", guardarCookie);
  document.getElementById("iniciarSesionBtn").addEventListener("click", iniciarSesion);
  document.getElementById("cerrarSesionBtn").addEventListener("click", cerrarSesion);
  document.getElementById("temaBtn").addEventListener("click", cambiarTema);
}

// ===================== INICIALIZACIÓN =====================

window.onload = function () {
  cargarTema();
  app.cargarProductos();

  const pagina = document.body.dataset.page;

  if (pagina === "inicio") {
    iniciarVistaInicio();
  }

  if (pagina === "productos") {
    iniciarVistaProductos();
  }

  if (pagina === "formulario-producto") {
    iniciarVistaFormulario();
  }

  if (pagina === "sesion") {
    iniciarVistaSesion();
  }
};
