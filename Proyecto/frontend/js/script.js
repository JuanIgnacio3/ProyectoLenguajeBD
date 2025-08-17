
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
    if (!response.ok) throw new Error("Error en la API de eventos");

    const eventos = await response.json();
    console.log("Eventos desde API:", eventos);
    eventos.forEach(evento => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${evento.NOMBRE}</td>
        <td>${evento.DESCRIPCION}</td>
        <td>${new Date(evento.FECHA).toLocaleDateString()}</td>
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


async function cargarCampanias() {
  const tabla = document.getElementById('campaniasTable');
  tabla.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3000/api/campanias');
    const campanias = await response.json();

    campanias.forEach(campania => {
      const row = document.createElement('tr');
      row.innerHTML = `
       <td>${campania.NOMBRE}</td>
       <td>${new Date(campania.FECHAINICIO).toLocaleDateString()}</td>
       <td>${new Date(campania.FECHAFIN).toLocaleDateString()}</td>
       <td>${campania.DESCRIPCION}</td>
        <td>
          <button class="btn btn-info btn-sm"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      tabla.appendChild(row);
    });
  } catch (err) {
    console.error('Error cargando campañas:', err);
    tabla.innerHTML = '<tr><td colspan="5">Error cargando campañas</td></tr>';
  }
}

async function cargarInventarios() {
  const tabla = document.getElementById('inventariosTable');
  tabla.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3000/api/inventarios');
    const inventarios = await response.json();

    inventarios.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.NOMBRE}</td>
        <td>${item.TIPO}</td>
        <td>${item.CANTIDAD}</td>
        <td>${item.FECHAINGRESO ? new Date(item.FECHAINGRESO).toLocaleDateString() : ''}</td>
        <td>${item.FECHACADUCIDAD ? new Date(item.FECHACADUCIDAD).toLocaleDateString() : ''}</td>
        <td>${item.PROVEEDOR}</td>
        <td>${item.FUENTE}</td>
        <td>
          <button class="btn btn-info btn-sm"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      tabla.appendChild(row);
    });
  } catch (err) {
    console.error('Error cargando inventarios:', err);
    tabla.innerHTML = '<tr><td colspan="8">Error cargando inventarios</td></tr>';
  }
}

async function cargarVoluntarios() {
  const tabla = document.getElementById('voluntariosTable');
  tabla.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3000/api/voluntarios');
    const voluntarios = await response.json();

    voluntarios.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.NOMBRE}</td>
        <td>${item.FECHAINICIO ? new Date(item.FECHAINICIO).toLocaleDateString() : ''}</td>
        <td>${item.FECHAFIN ? new Date(item.FECHAFIN).toLocaleDateString() : ''}</td>
        <td>${item.HORAS}</td>
        <td>${item.ESTADO}</td>
        <td>
          <button class="btn btn-info btn-sm"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      tabla.appendChild(row);
    });
  } catch (err) {
    console.error('Error cargando voluntarios:', err);
    tabla.innerHTML = '<tr><td colspan="6">Error cargando voluntarios</td></tr>';
  }
}



// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarMascotas(); // tu función anterior
  cargarEventos();  // nueva función
  cargarCampanias();
  cargarInventarios();
  cargarVoluntarios();
});

