document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('productosContainer');

    if (!contenedor) return;

    try {
        const respuesta = await fetch('http://localhost:4000/api/products');
        const data = await respuesta.json();

        if (!respuesta.ok) {
            contenedor.innerHTML = '<p>No se pudieron cargar los productos</p>';
            return;
        }

        const productos = data.data || data;

        if (!productos || productos.length === 0) {
            contenedor.innerHTML = '<p>No hay productos disponibles</p>';
            return;
        }

        contenedor.innerHTML = productos.map(producto => `
            <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                    <img src="${producto.image || 'https://via.placeholder.com/300x200'}" 
                         class="card-img-top" 
                         alt="${producto.name}"
                         style="height: 220px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.name}</h5>
                        <p class="card-text">${producto.description || 'Sin descripción'}</p>
                        <p class="fw-bold mb-3">$${producto.price}</p>
                        <button 
                            class="btn btn-primary mt-auto agregar-carrito"
                            data-id="${producto._id}"
                            data-name="${producto.name}"
                            data-price="${producto.price}"
                            data-image="${producto.image || 'https://via.placeholder.com/300x200'}">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const botones = document.querySelectorAll('.agregar-carrito');

        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                const producto = {
                    id: boton.dataset.id,
                    name: boton.dataset.name,
                    price: Number(boton.dataset.price),
                    image: boton.dataset.image,
                    quantity: 1
                };

                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

                const existente = carrito.find(item => item.id === producto.id);

                if (existente) {
                    existente.quantity += 1;
                } else {
                    carrito.push(producto);
                }

                localStorage.setItem('carrito', JSON.stringify(carrito));
                alert('Producto agregado al carrito');
            });
        });

    } catch (error) {
        console.error('Error al cargar productos:', error);
        contenedor.innerHTML = '<p>Error al conectar con el backend</p>';
    }
});