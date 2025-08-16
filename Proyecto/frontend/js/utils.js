// Función para hacer requests a la API
async function makeRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`http://localhost:3000/api${url}`, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la API');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para guardar datos en localStorage
function saveAuthData(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Función para obtener datos de localStorage
function getAuthData() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Función para eliminar datos de autenticación
function clearAuthData() {
    localStorage.removeItem('user');
}

// Función para verificar si el usuario está autenticado

// Función para verificar autenticación (modificada)
function checkAuth() {
    const user = getAuthData();
    const currentPage = window.location.pathname.split('/').pop();

    // Solo redirigir si:
    // - Usuario no logueado intenta acceder a dashboard
    if (user && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'dashboard.html';
    } else if (!user && currentPage === 'dashboard.html') {
        window.location.href = 'login.html';
    }
    // No hacer nada para la página principal (index.html)
}


// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', checkAuth);