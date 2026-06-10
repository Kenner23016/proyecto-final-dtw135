# Proyecto Final DTW135 - Sistema Web de Gestión de Tickets de Soporte
 
## Información general del proyecto
 
**Universidad:** Universidad de El Salvador  
**Facultad:** Facultad Multidisciplinaria de Occidente  
**Asignatura:** Desarrollo y Técnicas de Aplicaciones Web  
**Código de asignatura:** DTW135  
**Ciclo:** I - 2026  
**Tipo de proyecto:** Aplicación Web Interactiva Frontend  
**Tema seleccionado:** Gestión de tickets de soporte  
**Grupo / Sección:** GT01  
**Número de grupo:** [Agregar número de grupo si aplica]
 
## Integrantes del equipo
 
| Nombre completo | Carnet |
|---|---|
| Luis Fernando González Castañeda | GC23100 |
| Kenner Edilson Núñez Melgar | NM23016 |
| José Enrique Valencia Erazo | [Agregar carnet] |
| José Pauliño Colocho Bolaños | [Agregar carnet] |
 
## Descripción del sistema
 
Este proyecto consiste en el desarrollo de una aplicación web frontend orientada a la gestión de tickets de soporte. El sistema permite registrar, visualizar, editar y eliminar información relacionada con solicitudes o incidencias, facilitando el control básico de casos dentro de un entorno de atención o soporte técnico.
 
La aplicación fue desarrollada utilizando tecnologías propias del frontend, sin backend ni base de datos externa, cumpliendo con el enfoque solicitado para el proyecto. La persistencia de información se gestiona mediante almacenamiento local del navegador, permitiendo conservar los registros y ciertos datos de sesión durante el uso del sistema.
 
El proyecto integra funcionalidades como CRUD completo, dashboard de métricas, almacenamiento local, consumo de API externa, geolocalización y procesamiento de datos mediante Web Worker.
 
## Objetivo general
 
Desarrollar una aplicación web interactiva utilizando HTML5, CSS3 y JavaScript, aplicando los conocimientos adquiridos durante la asignatura Desarrollo y Técnicas de Aplicaciones Web.
 
## Objetivos específicos
 
- Implementar un CRUD completo para la gestión de registros.
- Aplicar validaciones, eventos y manipulación del DOM mediante JavaScript.
- Utilizar almacenamiento local del navegador para conservar información.
- Implementar un dashboard con métricas relevantes del sistema.
- Integrar un Web Worker para procesar información sin afectar directamente el hilo principal de la interfaz.
- Consumir una API REST moderna utilizando Fetch.
- Incorporar geolocalización como parte de la funcionalidad del sistema.
- Presentar una interfaz clara, funcional y adaptable para el usuario.
 
## Tecnologías utilizadas
 
- **HTML5:** estructura principal de las vistas del sistema.
- **CSS3:** diseño visual, estilos personalizados y adaptación de la interfaz.
- **JavaScript:** lógica del sistema, validaciones, eventos, CRUD, almacenamiento, consumo de API y manipulación del DOM.
- **LocalStorage:** almacenamiento persistente de registros y configuraciones.
- **SessionStorage:** manejo de información temporal durante la sesión del usuario.
- **Cookies:** almacenamiento complementario de datos básicos de uso.
- **Fetch API:** consumo de datos externos desde una API REST.
- **Geolocation API:** obtención de ubicación del usuario desde el navegador.
- **Web Workers:** procesamiento de datos en segundo plano.
- **Git y GitHub:** control de versiones y trabajo colaborativo del equipo.
 
## Funcionalidades principales
 
### 1. CRUD completo
 
El sistema permite realizar las operaciones básicas de gestión de registros:
 
- Crear nuevos registros.
- Listar registros existentes.
- Editar información registrada.
- Eliminar registros.
- Validar campos antes de guardar información.
- Mostrar mensajes o alertas según el resultado de las acciones.
- Manipular dinámicamente los elementos del DOM.
 
Además, se implementa manejo de errores mediante estructuras `try/catch`, con el objetivo de controlar posibles fallos durante la ejecución de las operaciones principales.
 
### 2. Dashboard de métricas
 
La aplicación incluye un dashboard donde se muestran datos relevantes del sistema, tales como cantidad total de registros, estados u otros indicadores relacionados con la información almacenada.
 
Este apartado permite visualizar de manera resumida el comportamiento general de los datos registrados en la aplicación.
 
### 3. Implementación de Web Worker
 
Se utiliza al menos un Web Worker para realizar procesamiento de datos en segundo plano. Esto permite ejecutar cálculos o análisis sin bloquear la interfaz principal del usuario.
 
El uso del Web Worker mejora la organización del código y demuestra la aplicación de procesamiento paralelo dentro de una aplicación web frontend.
 
### 4. Almacenamiento local
 
El sistema utiliza almacenamiento del navegador para conservar información sin necesidad de una base de datos externa.
 
Se implementa:
 
- **LocalStorage:** para guardar información persistente del sistema.
- **SessionStorage:** para almacenar datos temporales durante la sesión.
- **Cookies:** como mecanismo adicional de almacenamiento básico.
 
Con esto se cumple el requisito de almacenamiento local solicitado en el proyecto.
 
### 5. Consumo de API REST
 
El proyecto integra el consumo de una API externa utilizando `fetch`, permitiendo obtener datos en formato JSON y mostrarlos dentro del sistema.
 
Esta funcionalidad demuestra el manejo de peticiones HTTP desde JavaScript y la integración de información externa dentro de una aplicación web.
 
### 6. Geolocalización
 
La aplicación utiliza la API de geolocalización del navegador para obtener la ubicación del usuario, previa autorización.
 
Esta información se integra como parte de las funcionalidades del sistema y se relaciona con el dashboard o con la información complementaria mostrada en la interfaz.
 
### 7. Funcionalidad adicional
 
Como funcionalidad adicional, el sistema incluye opciones complementarias que mejoran la experiencia del usuario, como la exportación de información y una interfaz organizada para facilitar la administración de los datos.
 
## Estructura general del proyecto
 
```txt
proyecto-final-dtw135/
│
├── index.html
├── README.md
│
├── css/
│   ├── dashboard.css
│   └── login.css
│
├── js/
│   ├── app.js
│   └── workers/
│       └── auditoriaWorker.js
│
├── pages/
│   └── ...
│
└── docs/
    └── ...
```
 
## Forma de uso
 
1. Clonar o descargar el repositorio.
2. Abrir el proyecto en un editor de código, preferiblemente Visual Studio Code.
3. Ejecutar el archivo principal utilizando Live Server o abrir `index.html` desde el navegador.
4. Iniciar sesión o acceder al sistema según el flujo configurado.
5. Utilizar las opciones disponibles para registrar, editar, eliminar y visualizar información.
6. Revisar el dashboard para observar las métricas y datos generados.
 
## Repositorio del proyecto
 
**Repositorio en GitHub:**  
[Agregar enlace del repositorio]
 
## Video de presentación
 
**Video demostrativo del sistema:**  
[Agregar enlace del video]
 
En el video se muestra el funcionamiento general de la aplicación, incluyendo el flujo principal del sistema, el uso del CRUD, el dashboard, la geolocalización, el consumo de API externa y el procesamiento mediante Web Worker.
 
## Estado del proyecto
 
El proyecto se encuentra en versión final para entrega académica. Las funcionalidades principales solicitadas han sido implementadas utilizando únicamente tecnologías frontend, conforme a los lineamientos establecidos para la asignatura.
 
## Conclusión
 
Este proyecto permitió aplicar de forma práctica los principales contenidos estudiados en la asignatura, integrando HTML5, CSS3 y JavaScript en una aplicación web funcional. A través del desarrollo del sistema se reforzó el uso de eventos, validaciones, manipulación del DOM, almacenamiento local, consumo de API, geolocalización y Web Workers.
 
La aplicación representa una solución frontend completa para la gestión básica de tickets de soporte, manteniendo una estructura organizada, funcional y adecuada para los requerimientos del proyecto final.
