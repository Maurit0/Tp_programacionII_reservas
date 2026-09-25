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

    establecerFechaMinima(inputFecha);
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
    return valor !== "" && regexNombre.test(valor);
}

function validarEmail(input) {
    const valor = input.value.trim();
    const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return valor !== "" && regexEmail.test(valor);
}

function validarTelefono(input) {
    const valor = input.value.trim();
    const regexTel = /^[0-9]{8,12}$/;
    return valor !== "" && regexTel.test(valor);
}

function validarHorario(select) {
    return select.value !== "";
}