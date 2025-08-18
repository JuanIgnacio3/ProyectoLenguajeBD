// -----------------------------
// Registro de usuario
// -----------------------------
document.getElementById('registerButton')?.addEventListener('click', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    const registerError = document.getElementById('registerError');
    const registerSuccess = document.getElementById('registerSuccess');

    if (!nombre || !apellido || !email || !password) {
        registerError.textContent = 'Todos los campos son requeridos';
        registerSuccess.textContent = '';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, email, password, telefono: telefono || null, rol: 2 })
        });

        const data = await response.json();

        if (response.ok) {
            registerSuccess.textContent = '¡Registro exitoso!';
            registerError.textContent = '';
            document.getElementById('registerForm').reset();
        } else {
            registerError.textContent = data.error || 'Error en el registro';
            registerSuccess.textContent = '';
        }

    } catch (err) {
        console.error('Error de conexión:', err);
        registerError.textContent = 'Error de conexión con el servidor';
        registerSuccess.textContent = '';
    }
});

// -----------------------------
// Login de usuario
// -----------------------------
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginError = document.getElementById('loginError');

    if (!email || !password) {
        loginError.textContent = 'Email y contraseña son requeridos';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // <- importante para la sesión
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = 'dashboard.html';
        } else {
            loginError.textContent = data.error || 'Credenciales incorrectas';
        }

    } catch (err) {
        console.error('Error en login:', err);
        loginError.textContent = 'Error de conexión con el servidor';
    }
});

// -----------------------------
// Logout
// -----------------------------
document.getElementById('logoutBtn')?.addEventListener('click', async function () {
    try {
        await fetch('http://localhost:5000/auth/logout', { method: 'GET', credentials: 'include' });
    } catch (err) {
        console.error('Error en logout:', err);
    } finally {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
});

// -----------------------------
// Mostrar información del usuario en dashboard
// -----------------------------
document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const welcomeName = document.getElementById('welcomeName');
        const userName = document.getElementById('userName');

        if (welcomeName) welcomeName.textContent = user.NOMBRE;
        if (userName) userName.textContent = `${user.NOMBRE} ${user.APELLIDO}`;
    }
});
