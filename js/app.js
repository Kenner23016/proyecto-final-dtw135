// Proyecto: Inventario básico de productos
// Avance 1: HTML, CSS, JavaScript, DOM, eventos, arreglos, objetos,
// localStorage, sessionStorage y cookies.

// Objeto principal del proyecto
const app = {
  productos: [],
  productoEditando: null,

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
    if (!validarProducto(codigo, nombre, categoria, cantidad, precio)) {
      return;
    }

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
    this.render();

    sessionStorage.setItem("ultimaAccion", "Producto agregado");
    mostrarUltimaAccion();

    limpiarFormulario();
    mostrarMensaje("");
  },

  eliminarProducto: function (id) {
    this.productos = this.productos.filter(function (producto) {
      return producto.id !== id;
    });

    this.guardarProductos();
    this.render();

    sessionStorage.setItem("ultimaAccion", "Producto eliminado");
    mostrarUltimaAccion();
  },

  editarProducto: function (id) {
    const producto = this.productos.find(function (producto) {
      return producto.id === id;
    });

    if (producto) {
      document.getElementById("codigoInput").value = producto.codigo;
      document.getElementById("productoInput").value = producto.nombre;
      document.getElementById("categoriaInput").value = producto.categoria;
      document.getElementById("cantidadInput").value = producto.cantidad;
      document.getElementById("precioInput").value = producto.precio;
      document.getElementById("contador").textContent = producto.nombre.length;

      this.productoEditando = id;

      document.getElementById("agregarBtn").textContent = "Actualizar producto";
      document.getElementById("cancelarBtn").classList.remove("oculto");
    }
  },

  actualizarProducto: function (codigo, nombre, categoria, cantidad, precio) {
    if (!validarProducto(codigo, nombre, categoria, cantidad, precio)) {
      return;
    }

    this.productos = this.productos.map(function (producto) {
      if (producto.id === app.productoEditando) {
        producto.codigo = codigo;
        producto.nombre = nombre;
        producto.categoria = categoria;
        producto.cantidad = Number(cantidad);
        producto.precio = Number(precio);
      }

      return producto;
    });

    this.productoEditando = null;
    this.guardarProductos();
    this.render();

    sessionStorage.setItem("ultimaAccion", "Producto actualizado");
    mostrarUltimaAccion();

    limpiarFormulario();
    mostrarMensaje("");
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
  },

  render: function () {
    const tabla = document.getElementById("tablaProductos");
    tabla.innerHTML = "";

    if (this.productos.length === 0) {
      const fila = document.createElement("tr");
      const columna = document.createElement("td");

      columna.textContent = "No hay productos registrados";
      columna.colSpan = 7;
      columna.classList.add("sin-productos");

      fila.appendChild(columna);
      tabla.appendChild(fila);
    }

    this.productos.forEach(function (producto) {
      const fila = document.createElement("tr");

      const codigo = document.createElement("td");
      codigo.textContent = producto.codigo;

      const nombre = document.createElement("td");
      nombre.textContent = producto.nombre;

      const categoria = document.createElement("td");
      categoria.textContent = producto.categoria;

      const cantidad = document.createElement("td");
      cantidad.textContent = producto.cantidad;

      if (producto.cantidad <= 5) {
        cantidad.classList.add("stock-bajo");
      }

      const precio = document.createElement("td");
      precio.textContent = "$" + producto.precio.toFixed(2);

      const subtotal = document.createElement("td");
      subtotal.textContent = "$" + (producto.cantidad * producto.precio).toFixed(2);

      const acciones = document.createElement("td");

      const botonEditar = document.createElement("button");
      botonEditar.textContent = "Editar";
      botonEditar.classList.add("editar");
      botonEditar.setAttribute("data-id", producto.id);

      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.classList.add("eliminar");
      botonEliminar.setAttribute("data-id", producto.id);

      acciones.appendChild(botonEditar);
      acciones.appendChild(botonEliminar);

      fila.appendChild(codigo);
      fila.appendChild(nombre);
      fila.appendChild(categoria);
      fila.appendChild(cantidad);
      fila.appendChild(precio);
      fila.appendChild(subtotal);
      fila.appendChild(acciones);

      tabla.appendChild(fila);
    });

    document.getElementById("totalProductos").textContent = this.productos.length;
    document.getElementById("totalUnidades").textContent = this.calcularTotalUnidades();
    document.getElementById("valorInventario").textContent = "$" + this.calcularValorInventario().toFixed(2);
  }
};

// Validaciones básicas del formulario
function validarProducto(codigo, nombre, categoria, cantidad, precio) {
  if (!codigo.trim()) {
    mostrarMensaje("Ingrese el código del producto");
    return false;
  }

  if (!nombre.trim()) {
    mostrarMensaje("Ingrese el nombre del producto");
    return false;
  }

  if (!categoria.trim()) {
    mostrarMensaje("Seleccione una categoría");
    return false;
  }

  if (cantidad === "" || Number(cantidad) < 0 || isNaN(Number(cantidad))) {
    mostrarMensaje("Ingrese una cantidad válida");
    return false;
  }

  if (precio === "" || Number(precio) < 0 || isNaN(Number(precio))) {
    mostrarMensaje("Ingrese un precio válido");
    return false;
  }

  return true;
}

// Mostrar mensajes de validación
function mostrarMensaje(texto) {
  document.getElementById("mensaje").textContent = texto;
}

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById("codigoInput").value = "";
  document.getElementById("productoInput").value = "";
  document.getElementById("categoriaInput").value = "";
  document.getElementById("cantidadInput").value = "";
  document.getElementById("precioInput").value = "";
  document.getElementById("contador").textContent = "0";

  app.productoEditando = null;

  document.getElementById("agregarBtn").textContent = "Agregar producto";
  document.getElementById("cancelarBtn").classList.add("oculto");
}

// ===================== COOKIES =====================

function guardarCookie() {
  const usuario = document.getElementById("usuario").value;

  if (!usuario.trim()) {
    document.getElementById("mostrarUsuario").textContent = "Ingrese el nombre del encargado";
    return;
  }

  const fecha = new Date();
  fecha.setTime(fecha.getTime() + (7 * 24 * 60 * 60 * 1000));

  document.cookie = "usuario=" + usuario + "; expires=" + fecha.toUTCString();

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

  if (usuario) {
    document.getElementById("mostrarUsuario").textContent = "Encargado: " + usuario;
  } else {
    document.getElementById("mostrarUsuario").textContent = "No hay encargado guardado";
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

  if (estado) {
    document.getElementById("estadoSesion").textContent = "Sesión activa";
  } else {
    document.getElementById("estadoSesion").textContent = "Sesión cerrada";
  }
}

function mostrarUltimaAccion() {
  const accion = sessionStorage.getItem("ultimaAccion");

  if (accion) {
    document.getElementById("ultimaAccion").textContent = "Última acción: " + accion;
  } else {
    document.getElementById("ultimaAccion").textContent = "Sin acciones recientes";
  }
}

// ===================== EVENTOS =====================

document.getElementById("guardarUsuarioBtn").addEventListener("click", guardarCookie);

document.getElementById("temaBtn").addEventListener("click", cambiarTema);

document.getElementById("iniciarSesionBtn").addEventListener("click", iniciarSesion);

document.getElementById("cerrarSesionBtn").addEventListener("click", cerrarSesion);

document.getElementById("agregarBtn").addEventListener("click", function () {
  const codigo = document.getElementById("codigoInput").value;
  const nombre = document.getElementById("productoInput").value;
  const categoria = document.getElementById("categoriaInput").value;
  const cantidad = document.getElementById("cantidadInput").value;
  const precio = document.getElementById("precioInput").value;

  if (app.productoEditando) {
    app.actualizarProducto(codigo, nombre, categoria, cantidad, precio);
  } else {
    app.agregarProducto(codigo, nombre, categoria, cantidad, precio);
  }
});

document.getElementById("cancelarBtn").addEventListener("click", function () {
  limpiarFormulario();
  mostrarMensaje("");
});

document.getElementById("productoInput").addEventListener("input", function (evento) {
  document.getElementById("contador").textContent = evento.target.value.length;
});

// Delegación de eventos para editar y eliminar
document.getElementById("tablaProductos").addEventListener("click", function (evento) {
  const id = Number(evento.target.dataset.id);

  if (evento.target.classList.contains("editar")) {
    app.editarProducto(id);
  }

  if (evento.target.classList.contains("eliminar")) {
    app.eliminarProducto(id);
  }
});

// Inicialización del proyecto
window.onload = function () {
  mostrarCookie();
  cargarTema();
  mostrarSesion();
  mostrarUltimaAccion();

  app.cargarProductos();
  app.render();
};
