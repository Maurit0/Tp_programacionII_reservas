/**
 * ==========================================================================
 * VALIDACIONES.JS - Validación en tiempo real y lógica de reserva
 * Integrante: Tomás Ayala (@ayalatomas-tsa)
 * Programación II - UTN FRRo
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    const formReserva = document.getElementById("form-reserva");
    if (!formReserva) return;

    // Referencias a los campos del formulario
    const inputNombre = document.getElementById("nombre");
    const inputEmail = document.getElementById("email");
    const inputTelefono = document.getElementById("telefono");
    const inputFecha = document.getElementById("fecha");
    const selectHorario = document.getElementById("horario");
    const radiosCancha = document.querySelectorAll('input[name="cancha"]');
    const textareaNotas = document.getElementById("notas");
    const notasCounter = document.getElementById("notas-counter");
    const formAlert = document.getElementById("form-alert");

    // Establecemos la fecha mínima permitida (hoy) en el campo date
    establecerFechaMinima(inputFecha);

    // ======================================================================
    // 1. Validaciones en tiempo real (eventos 'input' y 'blur')
    // ======================================================================

    // Nombre y Apellido: al menos 3 letras, solo caracteres alfabéticos y espacios
    inputNombre.addEventListener("input", () => {
        validarNombre(inputNombre);
    });

    // Email: formato estándar de correo
    inputEmail.addEventListener("input", () => {
        validarEmail(inputEmail);
    });

    // Teléfono: solo números, entre 8 y 12 dígitos
    inputTelefono.addEventListener("input", () => {
        validarTelefono(inputTelefono);
    });

    // Fecha: no puede ser anterior al día de hoy
    inputFecha.addEventListener("change", () => {
        validarFecha(inputFecha);
        verificarDisponibilidadTurno();
    });

    // Horario: debe seleccionar una opción válida
    selectHorario.addEventListener("change", () => {
        validarHorario(selectHorario);
        verificarDisponibilidadTurno();
    });

    // Canchas (radio buttons)
    radiosCancha.forEach(radio => {
        radio.addEventListener("change", () => {
            validarCancha();
            verificarDisponibilidadTurno();
        });
    });

    // Contador de caracteres para el textarea
    if (textareaNotas && notasCounter) {
        textareaNotas.addEventListener("input", () => {
            const longitud = textareaNotas.value.length;
            notasCounter.textContent = `${longitud} / 200 caracteres`;
            if (longitud > 200) {
                notasCounter.style.color = "var(--color-error)";
            } else {
                notasCounter.style.color = "var(--text-muted)";
            }
        });
    }

    // ======================================================================
    // 2. Envío del formulario y persistencia en LocalStorage
    // ======================================================================
    formReserva.addEventListener("submit", (e) => {
        e.preventDefault();

        // Ejecutamos todas las validaciones antes de enviar
        const esNombreValido = validarNombre(inputNombre);
        const esEmailValido = validarEmail(inputEmail);
        const esTelefonoValido = validarTelefono(inputTelefono);
        const esFechaValida = validarFecha(inputFecha);
        const esHorarioValido = validarHorario(selectHorario);
        const esCanchaValida = validarCancha();

        // Si alguno falla, detenemos el envío y mostramos aviso
        if (!esNombreValido || !esEmailValido || !esTelefonoValido || !esFechaValida || !esHorarioValido || !esCanchaValida) {
            mostrarAlerta("Por favor, corregí los campos marcados en rojo antes de continuar.", "error");
            return;
        }

        // VALIDACIÓN CRUZADA: Verificar que el turno no esté ya ocupado
        const canchaSeleccionada = document.querySelector('input[name="cancha"]:checked').value;
        const fechaElegida = inputFecha.value;
        const horarioElegido = selectHorario.value;

        if (existeTurnoDuplicado(fechaElegida, horarioElegido, canchaSeleccionada)) {
            mostrarAlerta(`El horario de las ${horarioElegido} hs para la ${canchaSeleccionada} ya se encuentra reservado en esa fecha. Por favor elegí otro horario o cancha.`, "error");
            marcarError(selectHorario, "msg-horario", "Turno no disponible para esta cancha.");
            return;
        }

        // Obtenemos los adicionales seleccionados (checkboxes)
        const adicionalesSeleccionados = [];
        document.querySelectorAll('input[name="adicionales"]:checked').forEach(chk => {
            adicionalesSeleccionados.push(chk.value);
        });

        // Construimos el objeto de la nueva reserva
        const nuevaReserva = {
            id: Date.now(), // Identificador único numérico basado en timestamp
            nombre: inputNombre.value.trim(),
            email: inputEmail.value.trim(),
            telefono: inputTelefono.value.trim(),
            fecha: fechaElegida,
            horario: horarioElegido,
            cancha: canchaSeleccionada,
            adicionales: adicionalesSeleccionados,
            notas: textareaNotas.value.trim(),
            fechaRegistro: new Date().toLocaleDateString("es-AR")
        };

        // Guardamos en LocalStorage
        guardarReservaEnStorage(nuevaReserva);

        // Feedback positivo y reseteo
        mostrarAlerta(`¡Reserva confirmada con éxito a nombre de ${nuevaReserva.nombre}! Podés revisarla o modificarla en la sección "Mis Reservas".`, "success");
        formReserva.reset();
        limpiarEstadosValidacion();
        if (notasCounter) notasCounter.textContent = "0 / 200 caracteres";

        // Scroll suave al mensaje de éxito
        formAlert.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // Limpieza al presionar botón reset
    formReserva.addEventListener("reset", () => {
        limpiarEstadosValidacion();
        formAlert.classList.add("hidden");
    });
});

// ==========================================================================
// FUNCIONES AUXILIARES DE VALIDACIÓN
// ==========================================================================

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
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;

    if (valor === "") {
        marcarError(input, "msg-nombre", "El nombre y apellido son obligatorios.");
        return false;
    } else if (!regexNombre.test(valor)) {
        marcarError(input, "msg-nombre", "Ingresá un nombre válido (solo letras, mín. 3 caracteres).");
        return false;
    } else {
        marcarValido(input, "msg-nombre");
        return true;
    }
}

function validarEmail(input) {
    const valor = input.value.trim();
    const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

    if (valor === "") {
        marcarError(input, "msg-email", "El correo electrónico es obligatorio.");
        return false;
    } else if (!regexEmail.test(valor)) {
        marcarError(input, "msg-email", "Ingresá un correo válido (ej: nombre@dominio.com).");
        return false;
    } else {
        marcarValido(input, "msg-email");
        return true;
    }
}

function validarTelefono(input) {
    const valor = input.value.trim();
    const regexTel = /^[0-9]{8,12}$/;

    if (valor === "") {
        marcarError(input, "msg-telefono", "El teléfono de contacto es obligatorio.");
        return false;
    } else if (!regexTel.test(valor)) {
        marcarError(input, "msg-telefono", "Ingresá un teléfono válido de 8 a 12 dígitos (solo números).");
        return false;
    } else {
        marcarValido(input, "msg-telefono");
        return true;
    }
}

function validarFecha(input) {
    const valor = input.value;
    if (!valor) {
        marcarError(input, "msg-fecha", "Tenés que seleccionar una fecha para el turno.");
        return false;
    }

    const fechaSeleccionada = new Date(valor + "T00:00:00");
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
        marcarError(input, "msg-fecha", "La fecha del turno no puede ser anterior a hoy.");
        return false;
    } else {
        marcarValido(input, "msg-fecha");
        return true;
    }
}

function validarHorario(select) {
    const valor = select.value;
    if (!valor) {
        marcarError(select, "msg-horario", "Seleccioná una franja horaria.");
        return false;
    } else {
        marcarValido(select, "msg-horario");
        return true;
    }
}

function validarCancha() {
    const seleccionada = document.querySelector('input[name="cancha"]:checked');
    const msgCancha = document.getElementById("msg-cancha");
    const grupoCancha = document.getElementById("group-cancha");

    if (!seleccionada) {
        if (msgCancha) msgCancha.textContent = "Tenés que elegir una cancha para tu partido.";
        if (grupoCancha) grupoCancha.classList.add("is-invalid");
        return false;
    } else {
        if (msgCancha) msgCancha.textContent = "";
        if (grupoCancha) {
            grupoCancha.classList.remove("is-invalid");
            grupoCancha.classList.add("is-valid");
        }
        return true;
    }
}

function verificarDisponibilidadTurno() {
    const inputFecha = document.getElementById("fecha");
    const selectHorario = document.getElementById("horario");
    const canchaChecked = document.querySelector('input[name="cancha"]:checked');

    if (!inputFecha.value || !selectHorario.value || !canchaChecked) return;

    if (existeTurnoDuplicado(inputFecha.value, selectHorario.value, canchaChecked.value)) {
        marcarError(selectHorario, "msg-horario", "âš ï¸ Horario no disponible para esta cancha.");
    } else {
        if (selectHorario.value) {
            marcarValido(selectHorario, "msg-horario");
        }
    }
}

function existeTurnoDuplicado(fecha, horario, cancha, idExcluir = null) {
    const reservas = JSON.parse(localStorage.getItem("arena_reservas")) || [];
    return reservas.some(r => {
        if (idExcluir && r.id === idExcluir) return false;
        return r.fecha === fecha && r.horario === horario && r.cancha === cancha;
    });
}

function guardarReservaEnStorage(reserva) {
    const reservas = JSON.parse(localStorage.getItem("arena_reservas")) || [];
    reservas.push(reserva);
    localStorage.setItem("arena_reservas", JSON.stringify(reservas));
}

function marcarError(elemento, idMensaje, texto) {
    const grupo = elemento.closest(".form-group");
    const spanMsg = document.getElementById(idMensaje);
    if (grupo) {
        grupo.classList.remove("is-valid");
        grupo.classList.add("is-invalid");
    }
    if (spanMsg) {
        spanMsg.textContent = texto;
    }
}

function marcarValido(elemento, idMensaje) {
    const grupo = elemento.closest(".form-group");
    const spanMsg = document.getElementById(idMensaje);
    if (grupo) {
        grupo.classList.remove("is-invalid");
        grupo.classList.add("is-valid");
    }
    if (spanMsg) {
        spanMsg.textContent = "✓ Correcto";
    }
}

function limpiarEstadosValidacion() {
    document.querySelectorAll(".form-group").forEach(grupo => {
        grupo.classList.remove("is-valid", "is-invalid");
    });
    document.querySelectorAll(".feedback-message").forEach(msg => {
        msg.textContent = "";
    });
}

function mostrarAlerta(mensaje, tipo) {
    const formAlert = document.getElementById("form-alert");
    if (!formAlert) return;

    formAlert.textContent = mensaje;
    formAlert.className = `alert alert-${tipo}`;
    formAlert.classList.remove("hidden");
}