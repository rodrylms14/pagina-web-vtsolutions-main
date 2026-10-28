// Genera identificadores únicos para evitar nombres repetidos.
const { randomUUID } = require('node:crypto');

// Crea los datos válidos de un producto.
// Recibe el ID de una categoría existente porque el producto
// necesita estar relacionado con una categoría.
function createValidProduct(categoryId) {
  return {
    name: `Producto de prueba ${randomUUID()}`,
    description: 'Producto creado para pruebas automatizadas',
    price: 1500,
    image: 'https://example.com/producto.jpg',
    category: categoryId
  };
}

// Exporta la función para utilizarla desde products.test.js.
module.exports = {
  createValidProduct
};