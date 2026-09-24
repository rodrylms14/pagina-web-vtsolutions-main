document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');

    if (!registroForm) return;

    registroForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (!nombre || !correo || !password || !confirmPassword) {
            alert('Todos los campos son obligatorios');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const respuesta = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nombre,
                    email: correo,
                    password: password
                })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                alert(data.message || 'No se pudo registrar el usuario');
                return;
            }

            alert('Usuario registrado correctamente');
            registroForm.reset();
            window.location.href = 'Login.html';

        } catch (error) {
            console.error('Error en registro:', error);
            alert('No se pudo conectar con el servidor');
        }
    });
});