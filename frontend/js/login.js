document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        console.error('No se encontró el formulario de login');
        return;
    }

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            const respuesta = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                alert(data.message || 'Error al iniciar sesión');
                return;
            }

            localStorage.setItem('usuario', JSON.stringify(data.data));
            alert('Inicio de sesión correcto');
            window.location.href = 'catalogo.html';

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('No se pudo conectar con el servidor');
        }
    });
});