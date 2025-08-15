// Manejo del formulario de registro
document.getElementById('registerButton')?.addEventListener('click', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const telefono = document.getElementById('telefono').value;

    // Validación básica
    if (!nombre || !apellido || !email || !password) {
        document.getElementById('registerError').textContent = 'Todos los campos son requeridos';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                apellido,
                email,
                password,
                telefono: telefono || null,
                rol: 2
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

document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

   try {
    const response = await fetch('http://localhost:3000/api/users/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    const text = await response.text(); // primero lo tratamos como texto
    console.log('Respuesta del servidor:', text);

    // ahora sí intentar JSON si es correcto
    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error('No es JSON:', err);
        document.getElementById('loginError').textContent = 'Error del servidor: respuesta no válida';
        return;
    }

    if (response.ok) {
        const user = {
            id: data.ID,
            nombre: data.NOMBRE,
            apellido: data.APELLIDO,
            email: data.EMAIL,
            rol: data.ROL
        };
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('loginError').textContent = data.error || 'Credenciales inválidas';
    }

} catch (error) {
    document.getElementById('loginError').textContent = 'Error de conexión. Intente nuevamente.';
    console.error('Login error:', error);
}
});

// Manejo del logout
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    clearAuthData();
    window.location.href = 'login.html';
});

// Mostrar información del usuario en el dashboard
document.addEventListener('DOMContentLoaded', function () {
    const user = getAuthData();
    if (user && document.getElementById('welcomeName')) {
        document.getElementById('welcomeName').textContent = user.nombre;
        document.getElementById('userName').textContent = `${user.nombre} ${user.apellido}`;
    }
});
