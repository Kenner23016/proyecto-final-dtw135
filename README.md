# Proyecto Final DTW135 - StockFlow: Sistema Web de Inventario Básico de Productos

## Información general del proyecto

**Universidad:** Universidad de El Salvador  
**Facultad:** Facultad Multidisciplinaria de Occidente  
**Departamento:** Ingeniería y Arquitectura  
**Carrera:** Ingeniería en Desarrollo de Software  
**Asignatura:** Desarrollo y Técnicas de Aplicaciones Web  
**Código de asignatura:** DTW135  
**Ciclo:** I - 2026  
**Tipo de proyecto:** Aplicación Web Interactiva Frontend  
**Tema seleccionado:** Tema 4 - Inventario básico de productos  
**Grupo / Sección:** GT01  
**Número de grupo:** #4

## Integrantes del equipo

| Nombre completo | Carnet |
|---|---|
| Luis Fernando González Castañeda | GC23100 |
| Kenner Edilson Núñez Melgar | NM23016 |
| José Enrique Valencia Erazo | VE20008 |
| José Paulino Colocho Baños | CB11002 |

## Descripción del sistema

StockFlow es una aplicación web frontend orientada al control básico de inventario de productos. El sistema permite registrar, consultar, editar y eliminar productos, almacenando información como código, nombre, categoría, cantidad disponible y precio unitario.

La aplicación busca resolver la necesidad de llevar un control organizado de productos sin utilizar backend ni base de datos externa. Para ello, utiliza almacenamiento local del navegador, permitiendo conservar los datos registrados y mantener información temporal de sesión durante el uso del sistema.

El sistema incluye un panel principal con métricas del inventario, como total de productos registrados, unidades disponibles, valor estimado del inventario, productos con stock bajo, categorías registradas y actividad reciente. Además, incorpora funciones complementarias como búsqueda de productos, exportación del inventario en formato CSV, manejo de sesión simulada, cambio de tema visual, geolocalización del usuario y consulta de clima mediante una API externa.

## Objetivo general

Desarrollar una aplicación web interactiva para la gestión básica de inventario de productos, utilizando únicamente tecnologías frontend como HTML5, CSS3 y JavaScript.

## Objetivos específicos

- Implementar un CRUD completo para registrar, listar, editar y eliminar productos.
- Aplicar validaciones, eventos, funciones y manipulación del DOM mediante JavaScript.
- Utilizar LocalStorage para conservar los productos registrados.
- Utilizar SessionStorage y cookies para manejar información temporal de sesión.
- Presentar un dashboard con métricas relevantes del inventario.
- Implementar un Web Worker para procesar una auditoría de productos sin bloquear la interfaz principal.
- Consumir una API REST moderna mediante Fetch.
- Integrar geolocalización para obtener coordenadas del usuario y consultar información climática.
- Diseñar una interfaz visual clara, organizada y adaptable para facilitar la administración del inventario.

## Tecnologías utilizadas

- **HTML5:** estructura principal de las vistas del sistema.
- **CSS3:** diseño visual, estilos personalizados, distribución de contenido e interfaz responsiva.
- **JavaScript:** lógica principal del sistema, validaciones, eventos, CRUD, dashboard, almacenamiento, API externa, geolocalización y manipulación del DOM.
- **LocalStorage:** almacenamiento persistente de productos y configuración visual.
- **SessionStorage:** manejo de información temporal durante la sesión del usuario.
- **Cookies:** almacenamiento complementario de datos básicos del usuario.
- **Fetch API:** consumo de datos externos desde una API REST.
- **Geolocation API:** obtención de ubicación del usuario desde el navegador.
- **Web Workers:** procesamiento de auditoría del inventario en segundo plano.
- **Git y GitHub:** control de versiones y trabajo colaborativo del equipo.

## Funcionalidades principales

### 1. CRUD completo de productos

El sistema permite realizar las operaciones principales de un inventario básico:

- Crear nuevos productos.
- Listar productos existentes.
- Editar productos registrados.
- Eliminar productos.
- Validar campos obligatorios antes de guardar información.
- Evitar códigos duplicados.
- Controlar cantidades y precios inválidos.
- Mostrar mensajes o notificaciones según el resultado de cada acción.
- Manipular dinámicamente elementos del DOM.

Además, se implementa manejo de errores mediante estructuras `try/catch`, principalmente al cargar datos guardados y al procesar información almacenada en el navegador.

### 2. Dashboard de métricas

La aplicación incluye un dashboard donde se muestran datos relevantes del inventario, tales como:

- Total de productos registrados.
- Total de unidades disponibles.
- Valor estimado del inventario.
- Productos con stock bajo.
- Categorías registradas.
- Última acción realizada.
- Resumen de actividad reciente.

Este apartado permite visualizar de manera resumida el estado general del inventario.

### 3. Implementación de Web Worker

El proyecto utiliza un Web Worker para ejecutar una auditoría del inventario en segundo plano. Este proceso analiza los productos registrados y genera información como:

- Cantidad de productos analizados.
- Productos con stock bajo.
- Productos sin categoría.
- Categorías registradas.
- Producto más caro.
- Producto más barato.
- Producto con mayor stock.
- Producto con menor stock.
- Recomendaciones de reabastecimiento.

El uso del Web Worker permite procesar datos sin bloquear la interfaz principal del usuario.

### 4. Almacenamiento local

El sistema utiliza mecanismos de almacenamiento del navegador para conservar información sin necesidad de una base de datos externa.

Se implementa:

- **LocalStorage:** para guardar productos y preferencias visuales como el tema claro u oscuro.
- **SessionStorage:** para manejar sesión activa, usuario activo, producto en edición, última acción y notificaciones temporales.
- **Cookies:** para guardar información básica del usuario encargado.

Con esto se cumple el requisito de almacenamiento local solicitado en el proyecto.

### 5. Consumo de API REST

El proyecto integra el consumo de una API externa utilizando `fetch`. La aplicación consulta la API de Open-Meteo para obtener información climática actual según la ubicación del usuario.

La información obtenida se muestra en el dashboard como dato complementario del sistema.

### 6. Geolocalización

La aplicación utiliza la API de geolocalización del navegador para obtener la ubicación aproximada del usuario, previa autorización. A partir de las coordenadas obtenidas, el sistema consulta datos de clima mediante la API externa.

Esta funcionalidad permite cumplir con el requisito de geolocalización y complementa la información mostrada en el dashboard.

### 7. Funcionalidad adicional

Como funcionalidad adicional, el sistema incluye:

- Exportación del inventario en formato CSV.
- Cambio de tema visual.
- Notificaciones personalizadas.
- Confirmaciones antes de eliminar productos.
- Búsqueda de productos.
- Vista de administración.
- Manejo de sesión simulada.
- Auditoría del inventario mediante Web Worker.

Estas funciones mejoran la experiencia de uso y hacen que la aplicación sea más completa.

## Estructura general del proyecto

```txt
proyecto-final-dtw135/
│
├── index.html
├── login.html
├── README.md
│
├── assets/
│   └── .gitkeep
│
├── css/
│   ├── dashboard.css
│   └── login.css
│
├── docs/
│   └── reporte/
│       └── avance1.md
│
├── js/
│   └── app.js
│
├── pages/
│   ├── administracion.html
│   ├── producto-form.html
│   ├── productos.html
│   └── sesion.html
│
└── workers/
    └── auditoriaWorker.js
```

## Forma de uso

1. Clonar o descargar el repositorio.
2. Abrir el proyecto en un editor de código, preferiblemente Visual Studio Code.
3. Ejecutar el proyecto utilizando Live Server o abrir `index.html` desde el navegador.
4. Iniciar sesión con las credenciales configuradas.
5. Acceder al panel principal del sistema.
6. Registrar, editar, eliminar y consultar productos.
7. Revisar las métricas del dashboard.
8. Utilizar las opciones adicionales como exportación CSV, cambio de tema, consulta de sesión y auditoría del inventario.

## Credenciales de prueba

```txt
Usuario: admin
Contraseña: 1234
```

## Repositorio del proyecto

**Repositorio en GitHub:**  
https://github.com/Kenner23016/proyecto-final-dtw135.git

## Enlace de despliegue

**Servidor gratuito:**  
[Agregar enlace del proyecto desplegado]

## Estado del proyecto

El proyecto se encuentra en versión final para entrega académica. Las funcionalidades principales solicitadas han sido implementadas utilizando únicamente tecnologías frontend, conforme a los lineamientos establecidos para la asignatura.

## Conclusión

StockFlow permite aplicar de forma práctica los principales contenidos estudiados en la asignatura Desarrollo y Técnicas de Aplicaciones Web. El proyecto integra HTML5, CSS3 y JavaScript en una aplicación frontend funcional, incorporando CRUD, validaciones, manipulación del DOM, almacenamiento local, consumo de API REST, geolocalización, dashboard de métricas y procesamiento mediante Web Worker.

La aplicación representa una solución básica y organizada para la gestión de inventario de productos, cumpliendo con los requerimientos establecidos para el proyecto final.