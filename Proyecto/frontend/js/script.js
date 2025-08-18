async function cargarDatosTabla(url, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) {
    console.log(`No se encontró el tbody con id ${tbodyId}`);
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    tbody.innerHTML = "";
    data.forEach(item => {
      const row = document.createElement("tr");

      // Ejemplo genérico: se debe adaptar por cada tabla
      Object.values(item).forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(`Error cargando datos para ${tbodyId}:`, err);
  }
}

// Funciones específicas para cada tabla, ajustadas a tus rutas actuales
function cargarUsuarios() { cargarDatosTabla("/api/usuarios", "usuariosTable"); }
function cargarMascotas() { cargarDatosTabla("/api/mascotas", "mascotasTable"); }
function cargarEventos() { cargarDatosTabla("/api/eventos", "eventosTable"); }
function cargarCampanias() { cargarDatosTabla("/api/campanias", "campaniasTable"); }
function cargarInventarios() { cargarDatosTabla("/api/inventarios", "inventariosTable"); }
function cargarReportes() { cargarDatosTabla("/api/reportes", "reportesTable"); }
function cargarVoluntarios() { cargarDatosTabla("/api/voluntarios", "voluntariosTable"); }



// Ejecutar solo si existe el tbody correspondiente
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("usuariosTable")) cargarUsuarios();
  if (document.getElementById("mascotasTable")) cargarMascotas();
  if (document.getElementById("eventosTable")) cargarEventos();
  if (document.getElementById("campaniasTable")) cargarCampanias();
  if (document.getElementById("inventariosTable")) cargarInventarios();
  if (document.getElementById("reportesTable")) cargarReportes();
  if (document.getElementById("voluntariosTable")) cargarVoluntarios();

});
