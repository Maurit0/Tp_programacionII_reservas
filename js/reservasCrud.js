/**
 * ==========================================================================
 * RESERVASCRUD.JS - Gestión completa de reservas con LocalStorage (CRUD)
 * Integrante: Tomás Ayala (@ayalatomas-tsa)
 * Programación II - UTN FRRo
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-reservas");
    if (!contenedor) return;

    const inputBuscar = document.getElementById("input-buscar");
    const filtroCancha = document.getElementById("filtro-cancha");
    const statsTotal = document.getElementById("stats-total");
    const panelAlert = document.getElementById("panel-alert");

    const modal = document.getElementById("modal-edicion");
    const formEditar = document.getElementById("form-editar");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");
    const btnCancelarModal = document.getElementById("btn-cancelar-modal");

    cargarDatosInicialesSiVacio();
    actualizarVista();

    // 1. Buscador y Filtro en tiempo real
    if (inputBuscar) inputBuscar.addEventListener("input", actualizarVista);
    if (filtroCancha) filtroCancha.addEventListener("change", actualizarVista);

    // 2. Delegación de eventos para Cancelar y Editar
    contenedor.addEventListener("click", (e) => {
        const btnEliminar = e.target.closest(".btn-eliminar");
        if (btnEliminar) {
            const idReserva = Number(btnEliminar.dataset.id);
            confirmarYBorrarReserva(idReserva);
            return;
        }

        const btnEditar = e.target.closest(".btn-editar");
        if (btnEditar) {
            const idReserva = Number(btnEditar.dataset.id);
            abrirModalEdicion(idReserva);
            return;
        }
    });

    // 3. Modal de Edición
    if (btnCerrarModal) btnCerrarModal.addEventListener("click", cerrarModalEdicion);
    if (btnCancelarModal) btnCancelarModal.addEventListener("click", cerrarModalEdicion);

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) cerrarModalEdicion();
        });
    }

    if (formEditar) {
        formEditar.addEventListener("submit", (e) => {
            e.preventDefault();

            const idEditar = Number(document.getElementById("edit-id").value);
            const nuevoNombre = document.getElementById("edit-nombre").value.trim();
            const nuevaFecha = document.getElementById("edit-fecha").value;
            const nuevoHorario = document.getElementById("edit-horario").value;
            const nuevaCancha = document.getElementById("edit-cancha").value;

            if (!nuevoNombre || !nuevaFecha || !nuevoHorario || !nuevaCancha) {
                alert("Todos los campos con asterisco son obligatorios.");
                return;
            }

            const fechaObj = new Date(nuevaFecha + "T00:00:00");
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (fechaObj < hoy) {
                alert("La fecha no puede ser anterior a hoy.");
                return;
            }

            const reservas = obtenerReservasStorage();
            const choca = reservas.some(r => r.id !== idEditar && r.fecha === nuevaFecha && r.horario === nuevoHorario && r.cancha === nuevaCancha);
            if (choca) {
                alert(`El horario de las ${nuevoHorario} hs para la ${nuevaCancha} ya está ocupado.`);
                return;
            }

            const actualizadas = reservas.map(r => {
                if (r.id === idEditar) {
                    return { ...r, nombre: nuevoNombre, fecha: nuevaFecha, horario: nuevoHorario, cancha: nuevaCancha };
                }
                return r;
            });

            guardarReservasStorage(actualizadas);
            cerrarModalEdicion();
            actualizarVista();
            mostrarMensajePanel("Turno modificado correctamente.", "success");
        });
    }
});

function obtenerReservasStorage() {
    return JSON.parse(localStorage.getItem("arena_reservas")) || [];
}

function guardarReservasStorage(reservas) {
    localStorage.setItem("arena_reservas", JSON.stringify(reservas));
}

function actualizarVista() {
    const contenedor = document.getElementById("contenedor-reservas");
    const inputBuscar = document.getElementById("input-buscar");
    const filtroCancha = document.getElementById("filtro-cancha");
    const statsTotal = document.getElementById("stats-total");

    const reservas = obtenerReservasStorage();
    const texto = inputBuscar ? inputBuscar.value.toLowerCase().trim() : "";
    const canchaSel = filtroCancha ? filtroCancha.value : "todas";

    const filtradas = reservas.filter(r => {
        const matchTexto = r.nombre.toLowerCase().includes(texto) || r.fecha.includes(texto) || r.cancha.toLowerCase().includes(texto);
        const matchCancha = (canchaSel === "todas") || (r.cancha === canchaSel);
        return matchTexto && matchCancha;
    });

    if (statsTotal) statsTotal.textContent = `${filtradas.length} reservas activas`;

    if (filtradas.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No se encontraron reservas</h3>
                <p>${reservas.length === 0 ? "Aún no registraste ningún turno." : "Ninguna reserva coincide con los filtros aplicados."}</p>
                <a href="reservar.html" class="btn btn-primary">Reservar un Turno</a>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = "";
    filtradas.forEach(res => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "reserva-card";
        const [anio, mes, dia] = res.fecha.split("-");
        const fechaFormateada = `${dia}/${mes}/${anio}`;
        const extras = (res.adicionales && res.adicionales.length > 0) ? res.adicionales.join(", ") : "Ninguno";

        tarjeta.innerHTML = `
            <div class="reserva-card-header">
                <div>
                    <h3>${res.nombre}</h3>
                    <span class="reserva-cancha-badge">${res.cancha}</span>
                </div>
            </div>
            <div class="reserva-details">
                <span>📅 <strong>Fecha:</strong> ${fechaFormateada}</span>
                <span>⏰ <strong>Horario:</strong> ${res.horario} hs</span>
                <span>📞 <strong>Tel:</strong> ${res.telefono}</span>
                <span>✉️ <strong>Email:</strong> ${res.email}</span>
                <span><strong>Extras:</strong> ${extras}</span>
                ${res.notas ? `<span>💬 <em>"${res.notas}"</em></span>` : ""}
            </div>
            <div class="reserva-card-actions">
                <button class="btn btn-sm btn-outline btn-editar" data-id="${res.id}">✏️ Modificar</button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${res.id}">🗑️ Cancelar</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function confirmarYBorrarReserva(id) {
    if (!confirm("¿Estás seguro de que deseás cancelar este turno deportivo?")) return;
    const filtradas = obtenerReservasStorage().filter(r => r.id !== id);
    guardarReservasStorage(filtradas);
    actualizarVista();
    mostrarMensajePanel("La reserva ha sido cancelada correctamente.", "success");
}

function abrirModalEdicion(id) {
    const modal = document.getElementById("modal-edicion");
    const reserva = obtenerReservasStorage().find(r => r.id === id);
    if (!reserva || !modal) return;

    document.getElementById("edit-id").value = reserva.id;
    document.getElementById("edit-nombre").value = reserva.nombre;
    document.getElementById("edit-fecha").value = reserva.fecha;
    document.getElementById("edit-horario").value = reserva.horario;
    document.getElementById("edit-cancha").value = reserva.cancha;

    const inputEditFecha = document.getElementById("edit-fecha");
    if (inputEditFecha) {
        inputEditFecha.min = new Date().toISOString().split("T")[0];
    }
    modal.classList.remove("hidden");
}

function cerrarModalEdicion() {
    const modal = document.getElementById("modal-edicion");
    if (modal) modal.classList.add("hidden");
}

function mostrarMensajePanel(texto, tipo) {
    const panelAlert = document.getElementById("panel-alert");
    if (!panelAlert) return;
    panelAlert.textContent = texto;
    panelAlert.className = `alert alert-${tipo}`;
    panelAlert.classList.remove("hidden");
    setTimeout(() => panelAlert.classList.add("hidden"), 4000);
}

function cargarDatosInicialesSiVacio() {
    if (!localStorage.getItem("arena_reservas")) {
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        const pasado = new Date();
        pasado.setDate(pasado.getDate() + 2);
        const demo = [
            {
                id: 1718000000001,
                nombre: "Lucas Giménez",
                email: "lucas.gimenez@gmail.com",
                telefono: "3415896321",
                fecha: manana.toISOString().split("T")[0],
                horario: "19:00",
                cancha: "Cancha Central Cristal",
                adicionales: ["Paletas y Pelotas", "Vestuarios Premium"],
                notas: "Por favor dejar dos paletas preparadas.",
                fechaRegistro: new Date().toLocaleDateString("es-AR")
            },
            {
                id: 1718000000002,
                nombre: "Martina Benítez",
                email: "martina.b@hotmail.com",
                telefono: "3414987123",
                fecha: pasado.toISOString().split("T")[0],
                horario: "21:00",
                cancha: "Cancha Sintético Fútbol 5",
                adicionales: ["Iluminación Pro"],
                notas: "Torneo relámpago con amigos.",
                fechaRegistro: new Date().toLocaleDateString("es-AR")
            }
        ];
        localStorage.setItem("arena_reservas", JSON.stringify(demo));
    }
}