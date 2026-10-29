const { randomUUID } = require('node:crypto');

// Every call returns a new object; values belong only to this execution.
function categoryData(overrides = {}) {
  return { name: `QA categoría ${randomUUID()}`, ...overrides };
}
function productData(category, overrides = {}) {
  return {
    name: `QA producto ${randomUUID()}`, description: 'Producto sintético de prueba',
    price: 1250.5, image: '/img/producto01.jpg', category, ...overrides
  };
}
function cartData(user, product, overrides = {}) {
  return { user, products: [{ product, quantity: 2 }], ...overrides };
}
// Syntactically valid ID with no resource created for it.
function absentId() { return randomUUID().replaceAll('-', '').slice(0, 24); }

module.exports = { categoryData, productData, cartData, absentId };
