const http = require('../clients/httpClient');
const { createValidUser } = require('../data/authData');
const { categoryData, productData, cartData } = require('../data/catalogData');

function expectError(response, status, message) {
  expect(response.status).toBe(status);
  expect(response.data).toEqual({ ok: false, message });
}

function createTestData() {
  const owned = { cart: new Set(), products: new Set(), categories: new Set() };
  async function create(path, payload, group) {
    const response = await http.post(`/api/${path}`, payload);
    expect(response.status).toBe(201);
    expect(response.data.ok).toBe(true);
    expect(response.data.data._id).toMatch(/^[a-f\d]{24}$/);
    owned[group].add(response.data.data._id);
    return response.data.data;
  }
  return {
    trackCart(cart) { if (cart?._id) owned.cart.add(cart._id); },
    category: (payload = categoryData()) => create('categories', payload, 'categories'),
    product: (category, overrides) => create('products', productData(category, overrides), 'products'),
    cart: (user, product, overrides) => create('cart', cartData(user, product, overrides), 'cart'),
    async user() {
      const payload = createValidUser();
      const response = await http.post('/api/auth/register', payload);
      expect(response.status).toBe(201);
      expect(response.data.data.email).toBe(payload.email);
      return response.data.data;
    },
    async basket() {
      const user = await this.user();
      const category = await this.category();
      const product = await this.product(category._id);
      return { user, category, product };
    },
    async cleanup() {
      // Only IDs returned to this fixture are deleted. Users have no DELETE API;
      // the isolated runner drops its private temporary database after the suite.
      const errors = [];
      for (const group of ['cart', 'products', 'categories']) {
        for (const id of owned[group]) {
          try {
            const response = await http.delete(`/api/${group}/${id}`);
            if (![200, 404].includes(response.status)) throw new Error(`${group}: HTTP ${response.status}`);
          } catch (error) { errors.push(error.message); }
        }
      }
      if (errors.length) throw new Error(`Falló la limpieza de fixtures: ${errors.join('; ')}`);
    }
  };
}
module.exports = { createTestData, expectError };
