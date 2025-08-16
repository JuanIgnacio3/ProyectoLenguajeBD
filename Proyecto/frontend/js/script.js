async function cargarMascotas() {
  const tabla = document.getElementById('mascotasTable');
  tabla.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3000/api/mascotas');
    const mascotas = await response.json();

    mascotas.forEach(mascota => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${mascota.NOMBRE}</td>
        <td>${mascota.RAZA}</td>
        <td>${mascota.EDAD}</td>
        <td>${mascota.DESCRIPCION}</td>
        <td>${mascota.FOTO ? `<img src="${mascota.FOTO}" alt="${mascota.NOMBRE}" width="50">` : ''}</td>
        <td>${mascota.ESTADO}</td>
        <td>${mascota.DUENO}</td>
        <td>
          <button class="btn btn-info btn-sm"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      tabla.appendChild(row);
    });
  } catch (err) {
    console.error('Error cargando mascotas:', err);
    tabla.innerHTML = '<tr><td colspan="8">Error cargando mascotas</td></tr>';
  }
}

async function cargarEventos() {
  const tabla = document.getElementById('eventosTable');
  tabla.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3000/api/eventos');
    const eventos = await response.json();

    eventos.forEach(evento => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${evento.NOMBRE}</td>
        <td>${evento.DESCRIPCION}</td>
        <td>${evento.FECHA}</td>
        <td>${evento.UBICACION}</td>
        <td>${evento.RESPONSABLE}</td>
        <td>${evento.TIPO}</td>
        <td>${evento.ESTADO}</td>
        <td>
          <button class="btn btn-info btn-sm"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      tabla.appendChild(row);
    });
  } catch (err) {
    console.error('Error cargando eventos:', err);
    tabla.innerHTML = '<tr><td colspan="8">Error cargando eventos</td></tr>';
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarMascotas(); // tu función anterior
  cargarEventos();  // nueva función
});

