// formulario de registro
document.getElementById('registerButton')?.addEventListener('click', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const fechainicio = document.getElementById('fechainicio').value;
    const fechafin = document.getElementById('fechafin').value;
    const horas = document.getElementById('horas').value;
    const estado = document.getElementById('estado').value;

    // Validación básica
    if (!nombre || !fechainicio || !fechafin || !horas || !estado) {
        document.getElementById('registerError').textContent = 'Todos los campos son requeridos';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/voluntarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                fechainicio,
                fechafin: fechafin || null,
                horas,
                estado
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