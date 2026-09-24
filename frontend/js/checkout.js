document.addEventListener('DOMContentLoaded', () => {
    const btnConfirmar = document.getElementById('btnConfirmarCompra');

    if (!btnConfirmar) return;

    btnConfirmar.addEventListener('click', async () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        if (!usuario) {
            alert('Debes iniciar sesión');
            window.location.href = 'Login.html';
            return;
        }

        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const userId = usuario.id || usuario._id;

        if (!userId) {
            alert('No se encontró el id del usuario');
            return;
        }

        const payload = {
            user: userId,
            products: carrito.map(item => ({
                product: item.id,
                quantity: item.quantity
            })),
            total: carrito.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        };

        try {
            const respuesta = await fetch('http://localhost:4000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                alert(data.message || 'No se pudo crear la orden');
                return;
            }

            alert('Orden creada correctamente');
            localStorage.removeItem('carrito');
            window.location.href = 'catalogo.html';

        } catch (error) {
            console.error('Error al crear orden:', error);
            alert('No se pudo conectar con el servidor');
        }
    });
});