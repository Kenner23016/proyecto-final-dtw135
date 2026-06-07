// Proyecto: Inventario básico de productos
// Avance 1 mejorado: estructura por vistas/páginas.
// Se mantiene el estilo de las prácticas: objeto app, eventos, DOM,
// arreglos, objetos, localStorage, sessionStorage y cookies.

const app = {
  productos: [],

  cargarProductos: function () {
    const datos = localStorage.getItem("productos");

    if (!datos) {
      this.productos = [];
      return;
    }

    try {
      const productosGuardados = JSON.parse(datos);
      this.productos = Array.isArray(productosGuardados) ? productosGuardados : [];
    } catch (error) {
      this.productos = [];
      localStorage.removeItem("productos");
      sessionStorage.setItem("ultimaAccion", "Se reiniciaron datos dañados del inventario");
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
    sessionStorage.setItem("ultimaAccion", "Producto agregado: " + nombre);
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
    sessionStorage.setItem("ultimaAccion", "Producto actualizado: " + nombre);
  },

  eliminarProducto: function (id) {
    const productoEliminado = this.buscarProducto(id);

    this.productos = this.productos.filter(function (producto) {
      return producto.id !== id;
    });

    this.guardarProductos();

    if (productoEliminado) {
      sessionStorage.setItem("ultimaAccion", "Producto eliminado: " + productoEliminado.nombre);
    } else {
      sessionStorage.setItem("ultimaAccion", "Producto eliminado");
    }
  },

  buscarProducto: function (id) {
    return this.productos.find(function (producto) {
      return producto.id === id;
    });
  },

  existeCodigo: function (codigo, idActual) {
    const codigoNormalizado = codigo.trim().toLowerCase();

    return this.productos.some(function (producto) {
      return producto.codigo.trim().toLowerCase() === codigoNormalizado &&
             producto.id !== idActual;
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

const usuarioSimulado = {
  usuario: "admin",
  clave: "1234",
  nombre: "Administrador"
};

//FUNCIONES DE PRODUCTOS 

function validarProducto(codigo, nombre, categoria, cantidad, precio, idActual) {
  if (!codigo.trim()) {
    mostrarMensajeFormulario("Ingrese el código del producto");
    return false;
  }

  if (app.existeCodigo(codigo, idActual)) {
    mostrarMensajeFormulario("Ya existe un producto con ese código");
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

//NOTIFICACIONES TEMPORALES 

function crearContenedorNotificaciones() {
  let contenedor = document.getElementById("toastContainer");

  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "toastContainer";
    contenedor.classList.add("toast-container");
    document.body.appendChild(contenedor);
  }

  return contenedor;
}

function mostrarNotificacion(texto, tipo) {
  const contenedor = crearContenedorNotificaciones();
  const notificacion = document.createElement("div");
  const titulo = document.createElement("strong");
  const mensaje = document.createElement("p");

  notificacion.classList.add("toast");

  if (tipo) {
    notificacion.classList.add("toast-" + tipo);
  }

  titulo.textContent = tipo === "error" ? "Atención" : "Operación exitosa";
  mensaje.textContent = texto;

  notificacion.appendChild(titulo);
  notificacion.appendChild(mensaje);
  contenedor.appendChild(notificacion);

  setTimeout(function () {
    notificacion.classList.add("toast-saliendo");

    setTimeout(function () {
      notificacion.remove();
    }, 300);
  }, 6500);
}

function guardarNotificacionPendiente(texto, tipo) {
  const datos = {
    texto: texto,
    tipo: tipo || "success"
  };

  sessionStorage.setItem("notificacionPendiente", JSON.stringify(datos));
}

function procesarNotificacionPendiente() {
  const datosGuardados = sessionStorage.getItem("notificacionPendiente");

  if (!datosGuardados) {
    return;
  }

  try {
    const datos = JSON.parse(datosGuardados);
    mostrarNotificacion(datos.texto, datos.tipo);
  } catch (error) {
    mostrarNotificacion("Se realizó una acción en el sistema.", "success");
  }

  sessionStorage.removeItem("notificacionPendiente");
}

function mostrarConfirmacionPersonalizada(titulo, mensaje) {
  return new Promise(function (resolve) {
    const overlay = document.createElement("div");

    overlay.classList.add("modal-confirmacion-overlay");

    overlay.innerHTML = `
      <div class="modal-confirmacion">
        <div class="modal-confirmacion-icono">!</div>

        <div class="modal-confirmacion-contenido">
          <h3>${titulo}</h3>
          <p>${mensaje}</p>
        </div>

        <div class="modal-confirmacion-acciones">
          <button type="button" class="modal-btn modal-btn-secundario" id="cancelarEliminacionBtn">
            Cancelar
          </button>
          <button type="button" class="modal-btn modal-btn-peligro" id="confirmarEliminacionBtn">
            Eliminar producto
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const cancelarBtn = document.getElementById("cancelarEliminacionBtn");
    const confirmarBtn = document.getElementById("confirmarEliminacionBtn");

    function cerrar(resultado) {
      overlay.classList.add("modal-confirmacion-saliendo");

      setTimeout(function () {
        overlay.remove();
        resolve(resultado);
      }, 200);
    }

    cancelarBtn.addEventListener("click", function () {
      cerrar(false);
    });

    confirmarBtn.addEventListener("click", function () {
      cerrar(true);
    });

    overlay.addEventListener("click", function (evento) {
      if (evento.target === overlay) {
        cerrar(false);
      }
    });
  });
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
  const idEditando = Number(sessionStorage.getItem("productoEditando"));

  if (!validarProducto(codigo, nombre, categoria, cantidad, precio, idEditando)) {
    return;
  }

  if (idEditando) {
    app.actualizarProducto(idEditando, codigo, nombre, categoria, cantidad, precio);
    sessionStorage.removeItem("productoEditando");
    guardarNotificacionPendiente("Producto actualizado correctamente.", "success");
  } else {
    app.agregarProducto(codigo, nombre, categoria, cantidad, precio);
    guardarNotificacionPendiente("Producto agregado correctamente.", "success");
  }

  window.location.href = "productos.html";
}

function renderTablaProductos(lista) {
  const tabla = document.getElementById("tablaProductos");

  if (!tabla) {
    return;
  }

  tabla.textContent = "";

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

    agregarCeldaTexto(fila, producto.codigo);
    agregarCeldaTexto(fila, producto.nombre);
    agregarCeldaTexto(fila, producto.categoria);
    agregarCeldaTexto(fila, producto.cantidad);
    agregarCeldaTexto(fila, "$" + producto.precio.toFixed(2));
    agregarCeldaTexto(fila, "$" + subtotal.toFixed(2));

    const celdaEstado = document.createElement("td");
    const estado = document.createElement("span");
    estado.classList.add("estado-stock");

    if (claseEstado) {
      estado.classList.add(claseEstado);
    }

    estado.textContent = obtenerEstadoProducto(producto.cantidad);
    celdaEstado.appendChild(estado);
    fila.appendChild(celdaEstado);

    const celdaAcciones = document.createElement("td");
    const acciones = document.createElement("div");
    const editarBtn = document.createElement("button");
    const eliminarBtn = document.createElement("button");

    acciones.classList.add("acciones-tabla");
    editarBtn.textContent = "Editar";
    editarBtn.dataset.id = producto.id;
    editarBtn.classList.add("editar");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.dataset.id = producto.id;
    eliminarBtn.classList.add("eliminar", "secundario");

    acciones.appendChild(editarBtn);
    acciones.appendChild(eliminarBtn);
    celdaAcciones.appendChild(acciones);
    fila.appendChild(celdaAcciones);

    tabla.appendChild(fila);
  });
}

function agregarCeldaTexto(fila, texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  fila.appendChild(celda);
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

  tabla.textContent = "";

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

    agregarCeldaTexto(fila, producto.codigo);
    agregarCeldaTexto(fila, producto.nombre);
    agregarCeldaTexto(fila, producto.categoria);
    agregarCeldaTexto(fila, producto.cantidad);

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

// COOKIES 

function guardarCookie() {
  const usuario = document.getElementById("usuarioInput").value;

  if (!usuario.trim()) {
    document.getElementById("mostrarUsuario").textContent = "Ingrese el nombre del encargado";
    return;
  }

  const fecha = new Date();
  fecha.setTime(fecha.getTime() + (7 * 24 * 60 * 60 * 1000));
  document.cookie = "usuario=" + encodeURIComponent(usuario) + "; expires=" + fecha.toUTCString() + "; path=/";

  mostrarCookie();
}

function obtenerCookie(nombre) {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const partes = cookie.trim().split("=");

    if (partes[0] === nombre) {
      return decodeURIComponent(partes[1]);
    }
  }

  return null;
}

function mostrarCookie() {
  const usuario = obtenerCookie("usuario");
  const usuarioActivo = sessionStorage.getItem("usuarioActivo") || "Usuario";
  const mostrarUsuario = document.getElementById("mostrarUsuario");
  const nombreEncargado = document.getElementById("nombreEncargado");

  if (mostrarUsuario) {
    mostrarUsuario.textContent = usuario ? "Encargado guardado: " + usuario : "No hay encargado guardado";
  }

  if (nombreEncargado) {
    nombreEncargado.textContent = usuario ? usuario : usuarioActivo || "No registrado";
  }
}

function renderSaludoDashboard() {
  const saludo = document.getElementById("saludoUsuario");

  if (!saludo) {
    return;
  }

  const usuario = sessionStorage.getItem("usuarioActivo") || obtenerCookie("usuario") || "usuario";
  saludo.textContent = "Hola, " + usuario;
}

function obtenerTotalesPorCategoria() {
  const totales = {};

  app.productos.forEach(function (producto) {
    if (!totales[producto.categoria]) {
      totales[producto.categoria] = 0;
    }

    totales[producto.categoria] += producto.cantidad;
  });

  return totales;
}

function renderGraficoStock() {
  const canvas = document.getElementById("stockChart");

  if (!canvas) {
    return;
  }

  const contexto = canvas.getContext("2d");
  const ancho = canvas.width;
  const alto = canvas.height;
  const totales = obtenerTotalesPorCategoria();
  const categorias = Object.keys(totales);

  contexto.clearRect(0, 0, ancho, alto);
  contexto.font = "14px Arial";
  contexto.fillStyle = "rgba(226, 232, 240, 0.72)";

  if (categorias.length === 0) {
    contexto.font = "bold 15px Arial";
    contexto.fillStyle = "rgba(226, 232, 240, 0.45)";
    contexto.fillText("No hay datos suficientes para mostrar el gráfico.", 32, alto / 2);
    return;
  }

  const margenIzquierdo = 42;
  const margenInferior = 48;
  const margenSuperior = 24;
  const espacioDisponible = ancho - margenIzquierdo - 24;
  const altoDisponible = alto - margenSuperior - margenInferior;
  const maximo = Math.max.apply(null, categorias.map(function (categoria) {
    return totales[categoria];
  }));
  const anchoBarra = Math.max(32, espacioDisponible / categorias.length - 18);

  contexto.strokeStyle = "rgba(148, 163, 184, 0.55)";
  contexto.beginPath();
  contexto.moveTo(margenIzquierdo, margenSuperior);
  contexto.lineTo(margenIzquierdo, alto - margenInferior);
  contexto.lineTo(ancho - 18, alto - margenInferior);
  contexto.stroke();

  categorias.forEach(function (categoria, indice) {
    const valor = totales[categoria];
    const altoBarra = (valor / maximo) * altoDisponible;
    const x = margenIzquierdo + 18 + indice * (anchoBarra + 18);
    const y = alto - margenInferior - altoBarra;

    const gradiente = contexto.createLinearGradient(0, y, 0, alto - margenInferior);
    gradiente.addColorStop(0, indice % 2 === 0 ? "#38bdf8" : "#60a5fa");
    gradiente.addColorStop(1, indice % 2 === 0 ? "#1d4ed8" : "#0e7490");

    contexto.fillStyle = gradiente;
    contexto.fillRect(x, y, anchoBarra, altoBarra);

    contexto.fillStyle = "rgba(226, 232, 240, 0.92)";
    contexto.font = "bold 13px Arial";
    contexto.fillText(valor, x, y - 8);

    contexto.fillStyle = "rgba(203, 213, 225, 0.72)";
    contexto.font = "bold 12px Arial";
    contexto.fillText(categoria.slice(0, 12), x, alto - 22);
  });
}

function renderActividadReciente() {
  const contenedor = document.getElementById("actividadReciente");

  if (!contenedor) {
    return;
  }

  contenedor.textContent = "";

  const ultimaAccion = sessionStorage.getItem("ultimaAccion") || "Sin acciones recientes";
  const productosBajoStock = app.productos.filter(function (producto) {
    return producto.cantidad <= 5;
  }).length;
  const ultimoProducto = app.productos[app.productos.length - 1];
  const actividades = [
    {
      titulo: "Última acción",
      texto: ultimaAccion
    },
    {
      titulo: "Alertas de stock",
      texto: productosBajoStock + " producto(s) con stock bajo o agotado"
    },
    {
      titulo: "Registro reciente",
      texto: ultimoProducto ? ultimoProducto.nombre + " (" + ultimoProducto.codigo + ")" : "Aún no hay productos registrados"
    }
  ];

  actividades.forEach(function (actividad) {
    const item = document.createElement("div");
    const titulo = document.createElement("strong");
    const texto = document.createElement("p");

    item.classList.add("actividad-item");
    titulo.textContent = actividad.titulo;
    texto.textContent = actividad.texto;

    item.appendChild(titulo);
    item.appendChild(texto);
    contenedor.appendChild(item);
  });
}

//API REST Y GEOLOCALIZACIÓN

function actualizarTextoElemento(id, texto) {
  const elemento = document.getElementById(id);

  if (elemento) {
    elemento.textContent = texto;
  }
}

function obtenerPosicionActual() {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation) {
      reject(new Error("El navegador no permite usar geolocalización."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    });
  });
}

function obtenerDescripcionClima(codigo) {
  const estados = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos intensos",
    95: "Tormenta"
  };

  return estados[codigo] || "Condición no especificada";
}

async function consultarClimaActual(latitud, longitud) {
  const url = "https://api.open-meteo.com/v1/forecast" +
              "?latitude=" + encodeURIComponent(latitud) +
              "&longitude=" + encodeURIComponent(longitud) +
              "&current=temperature_2m,weather_code,wind_speed_10m";

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error("La API respondió con un error.");
    }

    const datos = await respuesta.json();
    const clima = datos.current;

    if (!clima) {
      throw new Error("La API no devolvió datos de clima actual.");
    }

    actualizarTextoElemento("temperaturaActual", clima.temperature_2m + " °C");
    actualizarTextoElemento("estadoClimaActual", obtenerDescripcionClima(clima.weather_code));
    actualizarTextoElemento("vientoActual", clima.wind_speed_10m + " km/h");
    actualizarTextoElemento(
      "climaResumen",
      clima.temperature_2m + " °C · " +
      obtenerDescripcionClima(clima.weather_code) +
      " · Viento " + clima.wind_speed_10m + " km/h"
    );
    actualizarTextoElemento("climaEstado", "Datos obtenidos desde Open-Meteo.");
  } catch (error) {
    actualizarTextoElemento("temperaturaActual", "No disponible");
    actualizarTextoElemento("estadoClimaActual", "No disponible");
    actualizarTextoElemento("vientoActual", "No disponible");
    actualizarTextoElemento("climaResumen", "Clima no disponible");
    actualizarTextoElemento("climaEstado", "No fue posible consultar el clima. Revise su conexión a internet.");
  }
}

async function cargarContextoDashboard() {
  try {
    const posicion = await obtenerPosicionActual();
    const latitud = posicion.coords.latitude.toFixed(5);
    const longitud = posicion.coords.longitude.toFixed(5);

    actualizarTextoElemento("latitudActual", latitud);
    actualizarTextoElemento("longitudActual", longitud);
    actualizarTextoElemento("ubicacionResumen", "Lat: " + latitud + " / Lon: " + longitud);
    actualizarTextoElemento("ubicacionEstado", "Ubicación detectada correctamente.");

    await consultarClimaActual(latitud, longitud);
  } catch (error) {
    actualizarTextoElemento("latitudActual", "No disponible");
    actualizarTextoElemento("longitudActual", "No disponible");
    actualizarTextoElemento("ubicacionResumen", "Ubicación no disponible");
    actualizarTextoElemento("ubicacionEstado", "No se pudo obtener la ubicación. Puede continuar usando el inventario.");
    actualizarTextoElemento("climaResumen", "Clima no disponible");
    actualizarTextoElemento("climaEstado", "El clima requiere permiso de ubicación para consultar las coordenadas.");
  }
}

//LOCAL STORAGE

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

//SESSION STORAGE

function sesionActiva() {
  return sessionStorage.getItem("sesion") === "activa";
}

function obtenerRutaLogin() {
  const estaEnPages = window.location.pathname.includes("/pages/");
  return estaEnPages ? "../login.html" : "login.html";
}

function obtenerRutaInicio() {
  const estaEnPages = window.location.pathname.includes("/pages/");
  return estaEnPages ? "../index.html" : "index.html";
}

function guardarUsuarioEnCookie(nombre) {
  const fecha = new Date();
  fecha.setTime(fecha.getTime() + (7 * 24 * 60 * 60 * 1000));
  document.cookie = "usuario=" + encodeURIComponent(nombre) + "; expires=" + fecha.toUTCString() + "; path=/";
}

function iniciarSesion(nombre) {
  sessionStorage.setItem("sesion", "activa");
  sessionStorage.setItem("usuarioActivo", nombre);
  mostrarSesion();
}

function cerrarSesion() {
  sessionStorage.removeItem("sesion");
  sessionStorage.removeItem("usuarioActivo");
  sessionStorage.removeItem("productoEditando");
  mostrarSesion();
  window.location.href = obtenerRutaLogin();
}

function validarAcceso(pagina) {
  if (pagina === "login") {
    if (sesionActiva()) {
      window.location.href = obtenerRutaInicio();
      return false;
    }

    return true;
  }

  if (!sesionActiva()) {
    window.location.href = obtenerRutaLogin();
    return false;
  }

  return true;
}

function mostrarSesion() {
  const estado = sesionActiva();
  const usuarioActivo = sessionStorage.getItem("usuarioActivo");
  const estadoSesion = document.getElementById("estadoSesion");

  if (estadoSesion) {
    estadoSesion.textContent = estado ? "Sesión activa: " + usuarioActivo : "Sesión cerrada";
  }
}

function mostrarMensajeLogin(texto) {
  const mensaje = document.getElementById("mensajeLogin");

  if (mensaje) {
    mensaje.textContent = texto;
  }
}

function validarLogin(evento) {
  evento.preventDefault();

  const usuario = document.getElementById("loginUsuario").value.trim();
  const clave = document.getElementById("loginClave").value.trim();

  if (!usuario || !clave) {
    mostrarMensajeLogin("Ingrese usuario y contraseña");
    return;
  }

  if (usuario !== usuarioSimulado.usuario || clave !== usuarioSimulado.clave) {
    mostrarMensajeLogin("Usuario o contraseña incorrectos");
    return;
  }

  iniciarSesion(usuarioSimulado.nombre);
  guardarUsuarioEnCookie(usuarioSimulado.nombre);
  window.location.href = "index.html";
}

function configurarBotonesCerrarSesion() {
  const botones = document.querySelectorAll(".cerrar-sesion-btn");

  botones.forEach(function (boton) {
    boton.addEventListener("click", cerrarSesion);
  });
}

function configurarSidebar() {
  const sidebar = document.getElementById("sidebar");
  const boton = document.getElementById("sidebarToggle");

  if (!sidebar || !boton) {
    return;
  }

  boton.addEventListener("click", function () {
    const estaColapsado = sidebar.classList.toggle("colapsado");
    document.body.classList.toggle("sidebar-colapsado", estaColapsado);
    boton.setAttribute("aria-expanded", String(!estaColapsado));
  });
}

function mostrarUltimaAccion() {
  const accion = sessionStorage.getItem("ultimaAccion");
  const ultimaAccion = document.getElementById("ultimaAccion");

  if (ultimaAccion) {
    ultimaAccion.textContent = accion ? "Última acción: " + accion : "Sin acciones recientes";
  }
}

// ADMINISTRACIÓN 
function renderActividadAdministrativa(ultimaAccion, productosBajoStock) {
  const contenedor = document.getElementById("adminActividad");

  if (!contenedor) {
    return;
  }

  contenedor.textContent = "";

  const actividades = [
    {
      titulo: "Última acción",
      texto: ultimaAccion
    },
    {
      titulo: "Control de stock",
      texto: productosBajoStock + " producto(s) con stock bajo o agotado"
    },
    {
      titulo: "Almacenamiento local",
      texto: "Los datos del inventario se conservan en localStorage"
    }
  ];

  actividades.forEach(function (actividad) {
    const item = document.createElement("div");
    const titulo = document.createElement("strong");
    const texto = document.createElement("p");

    item.classList.add("actividad-item");
    titulo.textContent = actividad.titulo;
    texto.textContent = actividad.texto;

    item.appendChild(titulo);
    item.appendChild(texto);
    contenedor.appendChild(item);
  });
}

function renderAdministracion() {
  const usuarioActivo = sessionStorage.getItem("usuarioActivo") || obtenerCookie("usuario") || "No registrado";
  const productosBajoStock = app.productos.filter(function (producto) {
    return producto.cantidad <= 5;
  }).length;

  const datosProductos = localStorage.getItem("productos") || "[]";
  const ultimaAccion = sessionStorage.getItem("ultimaAccion") || "Sin acciones recientes";

  actualizarTextoElemento("adminTotalProductos", app.productos.length);
  actualizarTextoElemento("adminTotalUnidades", app.calcularTotalUnidades());
  actualizarTextoElemento("adminValorInventario", "$" + app.calcularValorInventario().toFixed(2));
  actualizarTextoElemento("adminStockBajo", productosBajoStock);
  actualizarTextoElemento("adminUsuarioActivo", usuarioActivo);
  actualizarTextoElemento("adminEstadoSesion", sesionActiva() ? "Sesión activa" : "Sesión cerrada");
  actualizarTextoElemento("adminStorageInfo", "localStorage activo · " + datosProductos.length + " caracteres utilizados");

  renderActividadAdministrativa(ultimaAccion, productosBajoStock);
}

//EVENTOS POR VISTA

function iniciarVistaLogin() {
  document.getElementById("formLogin").addEventListener("submit", validarLogin);
}

function iniciarVistaInicio() {
  renderSaludoDashboard();
  renderResumen();
  renderUltimosProductos();
  renderGraficoStock();
  renderActividadReciente();
  cargarContextoDashboard();
  mostrarCookie();
  mostrarSesion();
  configurarBotonesCerrarSesion();
}

function iniciarVistaProductos() {
  renderTablaProductos(app.productos);
  configurarBotonesCerrarSesion();

  document.getElementById("buscarProducto").addEventListener("input", filtrarProductos);

  document.getElementById("tablaProductos").addEventListener("click", async function (evento) {
  const boton = evento.target.closest("button");

  if (!boton) {
    return;
  }

  const id = Number(boton.dataset.id);

  if (boton.classList.contains("editar")) {
    sessionStorage.setItem("productoEditando", id);
    window.location.href = "producto-form.html";
  }

  if (boton.classList.contains("eliminar")) {
    const confirmar = await mostrarConfirmacionPersonalizada(
      "Eliminar producto",
      "Esta acción eliminará el producto del inventario. No podrás recuperarlo después."
    );

    if (!confirmar) {
      return;
    }

    app.eliminarProducto(id);
    renderTablaProductos(app.productos);
    mostrarNotificacion("Producto eliminado correctamente.", "success");
  }
});
}

function iniciarVistaFormulario() {
  cargarFormularioProducto();
  configurarBotonesCerrarSesion();

  document.getElementById("formProducto").addEventListener("submit", guardarDesdeFormulario);

  document.getElementById("limpiarBtn").addEventListener("click", limpiarFormularioProducto);

  document.getElementById("productoInput").addEventListener("input", function (evento) {
    document.getElementById("contador").textContent = evento.target.value.length;
  });
}

function iniciarVistaAdministracion() {
  configurarBotonesCerrarSesion();
  mostrarSesion();
  renderAdministracion();
}

function iniciarVistaSesion() {
  mostrarCookie();
  mostrarSesion();
  mostrarUltimaAccion();
  configurarBotonesCerrarSesion();

  document.getElementById("guardarUsuarioBtn").addEventListener("click", guardarCookie);
  document.getElementById("cerrarSesionBtn").addEventListener("click", cerrarSesion);
  document.getElementById("temaBtn").addEventListener("click", cambiarTema);
}

//INICIALIZACIÓN 

window.onload = function () {
  cargarTema();

  const pagina = document.body.dataset.page;

  if (!validarAcceso(pagina)) {
    return;
  }

  app.cargarProductos();
  configurarSidebar();
  procesarNotificacionPendiente();

  if (pagina === "login") {
    iniciarVistaLogin();
  }

  if (pagina === "inicio") {
    iniciarVistaInicio();
  }

  if (pagina === "productos") {
    iniciarVistaProductos();
  }

  if (pagina === "formulario-producto") {
    iniciarVistaFormulario();
  }

  if (pagina === "administracion") {
    iniciarVistaAdministracion();
  }

  if (pagina === "sesion") {
    iniciarVistaSesion();
  }
};