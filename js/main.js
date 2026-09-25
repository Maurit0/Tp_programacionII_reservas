/**
 * ==========================================================================
 * MAIN.JS - Interactividad Global del Complejo Arena Rosario
 * Funcionalidades: Menú móvil hamburguesa, Modo Oscuro con LocalStorage
 * y Acordeón interactivo de Preguntas Frecuentes.
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // Inicializamos las funciones principales de la interfaz
    iniciarMenuMovil();
    iniciarModoOscuro();
    iniciarAcordeonFAQ();
});

/**
 * 1. Control del Menú Hamburguesa en Pantallas Pequeñas (Tablet / Mobile)
 */
function iniciarMenuMovil() {
    const btnMenu = document.getElementById("btn-menu");
    const mainNav = document.getElementById("main-nav");

    if (!btnMenu || !mainNav) return;

    // Al hacer clic en el botón hamburguesa
    btnMenu.addEventListener("click", () => {
        const estaAbierto = mainNav.classList.toggle("is-open");
        btnMenu.classList.toggle("is-active");
        btnMenu.setAttribute("aria-expanded", estaAbierto);
    });

    // Cerrar el menú automáticamente si se hace clic en cualquier enlace
    const enlacesNav = mainNav.querySelectorAll(".nav-link");
    enlacesNav.forEach(enlace => {
        enlace.addEventListener("click", () => {
            if (mainNav.classList.contains("is-open")) {
                mainNav.classList.remove("is-open");
                btnMenu.classList.remove("is-active");
                btnMenu.setAttribute("aria-expanded", "false");
            }
        });
    });
}

/**
 * 2. Modo Oscuro / Claro con Persistencia en LocalStorage
 */
function iniciarModoOscuro() {
    const btnTheme = document.getElementById("btn-theme");
    const themeIcon = document.getElementById("theme-icon");
    const CLAVE_STORAGE = "arena_tema_preferido";

    if (!btnTheme) return;

    // A. Comprobamos si el usuario ya tenía una preferencia guardada
    const temaGuardado = localStorage.getItem(CLAVE_STORAGE);

    if (temaGuardado === "dark") {
        document.body.classList.add("dark-mode");
        if (themeIcon) themeIcon.textContent = "☀️";
    } else {
        document.body.classList.remove("dark-mode");
        if (themeIcon) themeIcon.textContent = "🌙";
    }

    // B. Manejamos el evento de clic en el botón de alternar tema
    btnTheme.addEventListener("click", () => {
        const esOscuro = document.body.classList.toggle("dark-mode");

        if (esOscuro) {
            localStorage.setItem(CLAVE_STORAGE, "dark");
            if (themeIcon) themeIcon.textContent = "☀️";
        } else {
            localStorage.setItem(CLAVE_STORAGE, "light");
            if (themeIcon) themeIcon.textContent = "🌙";
        }
    });
}

/**
 * 3. Acordeón Interactivo de Preguntas Frecuentes (FAQ)
 */
function iniciarAcordeonFAQ() {
    const botonesAcordeon = document.querySelectorAll(".accordion-header");

    if (botonesAcordeon.length === 0) return;

    botonesAcordeon.forEach(boton => {
        boton.addEventListener("click", () => {
            const itemPadre = boton.closest(".accordion-item");
            const estaActivo = itemPadre.classList.contains("active");

            // Opcional: cerramos los otros acordeones abiertos para mantener orden
            document.querySelectorAll(".accordion-item").forEach(item => {
                item.classList.remove("active");
                const btn = item.querySelector(".accordion-header");
                if (btn) btn.setAttribute("aria-expanded", "false");
            });

            // Si no estaba activo, lo abrimos
            if (!estaActivo) {
                itemPadre.classList.add("active");
                boton.setAttribute("aria-expanded", "true");
            }
        });
    });
}
