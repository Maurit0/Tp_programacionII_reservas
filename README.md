# Simulador de Reservas - Arena Rosario (PÃ¡del & FÃºtbol Center)

Trabajo PrÃ¡ctico NÂ° 1 para la asignatura **ProgramaciÃ³n II**  
**Tecnicatura Universitaria en ProgramaciÃ³n - UTN Facultad Regional Rosario (FRRo)**  
Ciclo Lectivo: **2026**

---

## ðŸ‘¥ Integrantes del Equipo
* **Mauro Alegre** (GitHub: [@Maurit0](https://github.com/Maurit0))
* **TomÃ¡s Ayala** (GitHub: [@ayalatomas-tsa](https://github.com/ayalatomas-tsa))

---

## ðŸ“Œ DescripciÃ³n del Proyecto
**Arena Rosario** es una aplicaciÃ³n web frontend interactiva orientada a la reserva y gestiÃ³n de turnos para un complejo deportivo de canchas de pÃ¡del panorÃ¡micas y fÃºtbol 5 sintÃ©tico.

El sistema fue diseÃ±ado bajo una arquitectura limpia y modular de **4 pÃ¡ginas HTML semÃ¡nticas**, maquetado **exclusivamente con CSS3 nativo (Flexbox y CSS Grid)** sin frameworks externos, y con una capa de lÃ³gica en **JavaScript (ES6+)** que implementa validaciÃ³n de formularios en tiempo real y persistencia completa de datos mediante la API `localStorage` (simulando un backend local).

---

## ðŸ› ï¸ TecnologÃ­as y EstÃ¡ndares Utilizados
* **HTML5 SemÃ¡ntico:** Uso exhaustivo de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<address>` y `<footer>`.
* **CSS3 Nativo:** MaquetaciÃ³n combinada con **CSS Grid** (grilla de canchas, footer y layout) y **Flexbox** (navegaciÃ³n, tarjetas de beneficios y controles de formulario).
* **Responsive Web Design:** 3 puntos de quiebre (*breakpoints*) para Desktop (>1024px), Tablet (768px a 1023px) con menÃº hamburguesa colapsable animado, y Mobile (<480px) con reordenamiento en stack vertical.
* **JavaScript ES6+:** ManipulaciÃ³n del DOM mediante `querySelector` y `querySelectorAll`, delegaciÃ³n de eventos con `.closest()`, funciones flecha, template literals, expresiones regulares (RegEx) y desestructuraciÃ³n.
* **Almacenamiento Local (Web Storage API):** Persistencia en `localStorage` con serializaciÃ³n y deserializaciÃ³n a travÃ©s de `JSON.stringify()` y `JSON.parse()`.
* **Control de versiones:** Git y GitHub con flujo de trabajo distribuido y commits atÃ³micos por integrante.

---

## ðŸ“‹ Funcionalidades Implementadas

### 1. NavegaciÃ³n y PÃ¡ginas del Sitio
1. **`index.html` (Inicio):** Landing page con Hero Banner, llamado a la acciÃ³n (CTA), secciÃ³n de beneficios y presentaciÃ³n de canchas disponibles.
2. **`pages/servicios.html` (Instalaciones y Tarifas):** CatÃ¡logo tÃ©cnico con precios, servicios adicionales y componente de **Preguntas Frecuentes (FAQ)** interactivo con efecto acordeÃ³n.
3. **`pages/reservar.html` (Formulario Avanzado):** Formulario con 8 campos de distintos tipos (`text`, `email`, `tel`, `date`, `select`, `radio group`, `checkbox group`, `textarea`).
4. **`pages/mis-reservas.html` (Panel de GestiÃ³n CRUD):** VisualizaciÃ³n en vivo de turnos registrados, buscador en tiempo real, filtro por cancha y contador dinÃ¡mico.

### 2. Validaciones en Tiempo Real y ValidaciÃ³n Cruzada
* **Nombre y Apellido:** ValidaciÃ³n mediante RegEx (`/^[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘\s]{3,50}$/`).
* **Email:** ValidaciÃ³n de formato estÃ¡ndar de correo electrÃ³nico.
* **TelÃ©fono:** ValidaciÃ³n de longitud y formato numÃ©rico (8 a 12 dÃ­gitos).
* **Fecha:** Control temporal que impide reservar en fechas anteriores al dÃ­a actual.
* **ValidaciÃ³n Cruzada (Anti Doble Turno):** Al elegir fecha, horario y cancha, el sistema verifica en `localStorage` si ese turno ya estÃ¡ ocupado, advirtiendo al usuario antes de enviar el formulario.
* **Feedback Visual:** Bordes verdes/rojos dinÃ¡micos con Ã­conos vectoriales SVG y mensajes contextuales de error o confirmaciÃ³n.

### 3. SimulaciÃ³n de Backend con `localStorage` (CRUD Completo)
* **Create (Crear):** Al confirmar el turno en el formulario, se crea un objeto con ID Ãºnico (timestamp) y se almacena en el array de reservas de `localStorage`.
* **Read (Leer):** Las reservas se leen dinÃ¡micamente y se renderizan en tarjetas informativas con fechas formateadas y lista de extras.
* **Update (Editar):** Ventana modal interactiva que permite modificar el titular, la fecha, el horario y la cancha de cualquier turno existente con validaciÃ³n cruzada.
* **Delete (Eliminar):** BotÃ³n para cancelar reservas con confirmaciÃ³n previa y eliminaciÃ³n inmediata tanto del DOM como del almacenamiento local.

### 4. Extras y DesafÃ­os Adicionales
* **Modo Oscuro / Claro persistente:** Toggle de tema con Ã­cono animado que recuerda la preferencia del usuario en `localStorage` entre sesiones.
* **Buscador y Filtrado en Vivo:** Filtrado reactivo en el evento `input` que busca simultÃ¡neamente por titular, cancha o fecha.
* **Precarga de Datos Iniciales (Demo):** Si el navegador no tiene reservas previas, el sistema carga automÃ¡ticamente dos turnos de prueba para facilitar la correcciÃ³n y evaluaciÃ³n del docente.

---

## ðŸš€ Instrucciones para Ejecutar el Proyecto
1. Clonar el repositorio pÃºblico:
   ```bash
   git clone https://github.com/Maurit0/Tp_programacionII_reservas.git
   ```
2. Acceder al directorio:
   ```bash
   cd Tp_programacionII_reservas
   ```
3. Abrir en **Visual Studio Code**.
4. Iniciar mediante la extensiÃ³n **Live Server** (haciendo clic derecho en `index.html` > *Open with Live Server*), o abrir directamente el archivo `index.html` en Google Chrome, Mozilla Firefox o Microsoft Edge.

---

## ðŸ“‚ Estructura del Repositorio
```text
/
â”œâ”€â”€ .gitignore
â”œâ”€â”€ README.md
â”œâ”€â”€ index.html
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ servicios.html
â”‚   â”œâ”€â”€ reservar.html
â”‚   â””â”€â”€ mis-reservas.html
â”œâ”€â”€ css/
â”‚   â”œâ”€â”€ base.css
â”‚   â”œâ”€â”€ layout.css
â”‚   â”œâ”€â”€ components.css
â”‚   â””â”€â”€ form.css
â”œâ”€â”€ js/
â”‚   â”œâ”€â”€ main.js
â”‚   â”œâ”€â”€ validaciones.js
â”‚   â””â”€â”€ reservasCrud.js
â””â”€â”€ assets/
    â””â”€â”€ icons/
        â””â”€â”€ favicon.svg
```