/**
 * ==========================================================================
 * VALIDACIONES.JS - ValidaciÃ³n del Formulario de Reservas
 * Integrante: TomÃ¡s Ayala (@ayalatomas-tsa)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    const formReserva = document.getElementById("form-reserva");
    if (!formReserva) return;

    const inputNombre = document.getElementById("nombre");
    const inputEmail = document.getElementById("email");
    const inputTelefono = document.getElementById("telefono");
    const inputFecha = document.getElementById("fecha");
    const selectHorario = document.getElementById("horario");
    const radiosCancha = document.querySelectorAll('input[name="cancha"]');
    const textareaNotas = document.getElementById("notas");
    const notasCounter = document.getElementById("notas-counter");

    establecerFechaMinima(inputFecha);

    // Validaciones en tiempo real
    inputNombre.addEventListener("input", () => validarNombre(inputNombre));
    inputEmail.addEventListener("input", () => validarEmail(inputEmail));
    inputTelefono.addEventListener("input", () => validarTelefono(inputTelefono));
    inputFecha.addEventListener("change", () => validarFecha(inputFecha));
    selectHorario.addEventListener("change", () => validarHorario(selectHorario));

    radiosCancha.forEach(radio => {
        radio.addEventListener("change", () => validarCancha());
    });

    if (textareaNotas && notasCounter) {
        textareaNotas.addEventListener("input", () => {
            const len = textareaNotas.value.length;
            notasCounter.textContent = `${len} / 200 caracteres`;
            notasCounter.style.color = len > 200 ? "var(--color-error)" : "var(--text-muted)";
        });
    }
});

function establecerFechaMinima(inputFecha) {
    if (!inputFecha) return;
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    inputFecha.min = `${anio}-${mes}-${dia}`;
}

function validarNombre(input) {
    const valor = input.value.trim();
    const regexNombre = /^[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘\s]{3,50}$/;
    if (valor === "" || !regexNombre.test(valor)) {
        marcarError(input, "msg-nombre", "IngresÃ¡ un nombre vÃ¡lido (solo letras, mÃ­n. 3 caracteres).");
        return false;
    }
    marcarValido(input, "msg-nombre");
    return true;
}

function validarEmail(input) {
    const valor = input.value.trim();
    const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (valor === "" || !regexEmail.test(valor)) {
        marcarError(input, "msg-email", "IngresÃ¡ un correo vÃ¡lido (ej: nombre@dominio.com).");
        return false;
    }
    marcarValido(input, "msg-email");
    return true;
}

function validarTelefono(input) {
    const valor = input.value.trim();
    const regexTel = /^[0-9]{8,12}$/;
    if (valor === "" || !regexTel.test(valor)) {
        marcarError(input, "msg-telefono", "IngresÃ¡ un telÃ©fono vÃ¡lido de 8 a 12 dÃ­gitos.");
        return false;
    }
    marcarValido(input, "msg-telefono");
    return true;
}

function validarFecha(input) {
    if (!input.value) {
        marcarError(input, "msg-fecha", "TenÃ©s que seleccionar una fecha.");
        return false;
    }
    const fechaObj = new Date(input.value + "T00:00:00");
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaObj < hoy) {
        marcarError(input, "msg-fecha", "La fecha no puede ser anterior a hoy.");
        return false;
    }
    marcarValido(input, "msg-fecha");
    return true;
}

function validarHorario(select) {
    if (!select.value) {
        marcarError(select, "msg-horario", "SeleccionÃ¡ un horario.");
        return false;
    }
    marcarValido(select, "msg-horario");
    return true;
}

function validarCancha() {
    const seleccionada = document.querySelector('input[name="cancha"]:checked');
    const msg = document.getElementById("msg-cancha");
    const grupo = document.getElementById("group-cancha");
    if (!seleccionada) {
        if (msg) msg.textContent = "TenÃ©s que elegir una cancha.";
        if (grupo) { grupo.classList.add("is-invalid"); grupo.classList.remove("is-valid"); }
        return false;
    }
    if (msg) msg.textContent = "";
    if (grupo) { grupo.classList.remove("is-invalid"); grupo.classList.add("is-valid"); }
    return true;
}

function marcarError(elemento, idMensaje, texto) {
    const grupo = elemento.closest(".form-group");
    const spanMsg = document.getElementById(idMensaje);
    if (grupo) { grupo.classList.remove("is-valid"); grupo.classList.add("is-invalid"); }
    if (spanMsg) spanMsg.textContent = texto;
}

function marcarValido(elemento, idMensaje) {
    const grupo = elemento.closest(".form-group");
    const spanMsg = document.getElementById(idMensaje);
    if (grupo) { grupo.classList.remove("is-invalid"); grupo.classList.add("is-valid"); }
    if (spanMsg) spanMsg.textContent = "âœ“ Correcto";
}