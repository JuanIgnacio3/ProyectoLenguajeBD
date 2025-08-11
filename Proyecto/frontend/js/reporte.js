// formulario de registro
document.getElementById('registerButton')?.addEventListener('click', async function (e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const usuario = document.getElementById('usuario').value;
    const mascota = document.getElementById('mascota').value;
    const provincia = document.getElementById('provincia').value;
    const canton = document.getElementById('canton').value;
    const distrito = document.getElementById('distrito').value;
    const detalles = document.getElementById('detalles').value;

    // Validación básica
    if (!fecha || !usuario || !mascota || !provincia || !canton || !distrito || !detalles) {
        document.getElementById('registerError').textContent = 'Todos los campos son requeridos';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/reportes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fecha,
                usuario,
                mascota,
                provincia,
                canton,
                distrito,
                detalles
            })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('registerSuccess').textContent = '¡Registro exitoso!';
            document.getElementById('registerError').textContent = '';

            document.getElementById('registerForm').reset();


        } else {
            document.getElementById('registerError').textContent = data.error || 'Error en el registro';
        }
    } catch (error) {
        document.getElementById('registerError').textContent = 'Error de conexión con el servidor';
        console.error('Error:', error);
    }
});