/**
 * ==========================================================================
 * RESERVASCRUD.JS - GestiÃ³n de Reservas con LocalStorage
 * Integrante: TomÃ¡s Ayala (@ayalatomas-tsa)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-reservas");
    if (!contenedor) return;

    cargarDatosInicialesSiVacio();
    actualizarVista();

    // DelegaciÃ³n de eventos para cancelar
    contenedor.addEventListener("click", (e) => {
        const btnEliminar = e.target.closest(".btn-eliminar");
        if (btnEliminar) {
            const idReserva = Number(btnEliminar.dataset.id);
            confirmarYBorrarReserva(idReserva);
        }
    });
});

function obtenerReservasStorage() {
    return JSON.parse(localStorage.getItem("arena_reservas")) || [];
}

function guardarReservasStorage(reservas) {
    localStorage.setItem("arena_reservas", JSON.stringify(reservas));
}

function actualizarVista() {
    const contenedor = document.getElementById("contenedor-reservas");
    const statsTotal = document.getElementById("stats-total");
    const reservas = obtenerReservasStorage();

    if (statsTotal) statsTotal.textContent = `${reservas.length} reservas activas`;

    if (reservas.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">ðŸ“…</div>
                <h3>No tenÃ©s reservas registradas</h3>
                <p>Cuando confirmes un turno desde el formulario, aparecerÃ¡ listado aquÃ­.</p>
                <a href="reservar.html" class="btn btn-primary">Reservar un Turno</a>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = "";
    reservas.forEach(res => {
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
                <span>ðŸ“… <strong>Fecha:</strong> ${fechaFormateada}</span>
                <span>â° <strong>Horario:</strong> ${res.horario} hs</span>
                <span>ðŸ“ž <strong>Tel:</strong> ${res.telefono}</span>
                <span>âœ‰ï¸ <strong>Email:</strong> ${res.email}</span>
                <span><strong>Extras:</strong> ${extras}</span>
                ${res.notas ? `<span>ðŸ’¬ <em>"${res.notas}"</em></span>` : ""}
            </div>
            <div class="reserva-card-actions">
                <button class="btn btn-sm btn-outline btn-editar" data-id="${res.id}">âœï¸ Modificar</button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${res.id}">ðŸ—‘ï¸ Cancelar</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function confirmarYBorrarReserva(id) {
    if (!confirm("Â¿DeseÃ¡s cancelar esta reserva?")) return;
    const reservas = obtenerReservasStorage().filter(r => r.id !== id);
    guardarReservasStorage(reservas);
    actualizarVista();
}

function cargarDatosInicialesSiVacio() {
    if (!localStorage.getItem("arena_reservas")) {
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        const demo = [{
            id: 1718000000001,
            nombre: "Lucas GimÃ©nez",
            email: "lucas.gimenez@gmail.com",
            telefono: "3415896321",
            fecha: manana.toISOString().split("T")[0],
            horario: "19:00",
            cancha: "Cancha Central Cristal",
            adicionales: ["Paletas y Pelotas"],
            notas: "Turno de prueba",
            fechaRegistro: new Date().toLocaleDateString("es-AR")
        }];
        localStorage.setItem("arena_reservas", JSON.stringify(demo));
    }
}