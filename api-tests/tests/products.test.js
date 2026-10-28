// Cliente HTTP para comunicarnos con el backend.
const httpClient = require('../clients/httpClient');

// Funciones para generar datos de prueba.
const { createValidCategory } = require('../data/categoryData');
const { createValidProduct } = require('../data/productData');

describe('Pruebas funcionales de productos', () => {
  let categoryId;
  let productId;

  // Limpia los productos y categorías creados después de cada prueba.
  afterEach(async () => {
    if (productId) {
      await httpClient.delete(`/api/products/${productId}`);
      productId = undefined;
    }

    if (categoryId) {
      await httpClient.delete(`/api/categories/${categoryId}`);
      categoryId = undefined;
    }
  });

  // PROD-01: crear un producto válido.
  test('PROD-01 - Crear producto correctamente', async () => {
    // Crear primero una categoría válida.
    const category = createValidCategory();
    const categoryResponse = await httpClient.post(
      '/api/categories',
      category
    );

    categoryId = categoryResponse.data.data._id;

    // Crear el producto relacionado con esa categoría.
    const product = createValidProduct(categoryId);
    const response = await httpClient.post(
      '/api/products',
      product
    );

    productId = response.data.data?._id;

    expect(response.status).toBe(201);
    expect(response.data.ok).toBe(true);
    expect(response.data.data).toHaveProperty('_id');
    expect(response.data.data.name).toBe(product.name);
  });

  // PROD-02: consultar todos los productos.
  test('PROD-02 - Consultar productos correctamente', async () => {
    const category = createValidCategory();
    const categoryResponse = await httpClient.post(
      '/api/categories',
      category
    );

    categoryId = categoryResponse.data.data._id;

    const product = createValidProduct(categoryId);
    const createResponse = await httpClient.post(
      '/api/products',
      product
    );

    productId = createResponse.data.data._id;

    const response = await httpClient.get('/api/products');

    expect(response.status).toBe(200);
    expect(response.data.ok).toBe(true);
    expect(Array.isArray(response.data.data)).toBe(true);

    const productExists = response.data.data.some(
      (item) => item._id === productId
    );

    expect(productExists).toBe(true);
  });

  // PROD-03: consultar un producto específico por su ID.
  test('PROD-03 - Consultar producto por ID', async () => {
    const category = createValidCategory();
    const categoryResponse = await httpClient.post(
      '/api/categories',
      category
    );

    categoryId = categoryResponse.data.data._id;

    const product = createValidProduct(categoryId);
    const createResponse = await httpClient.post(
      '/api/products',
      product
    );

    productId = createResponse.data.data._id;

    const response = await httpClient.get(
      `/api/products/${productId}`
    );

    expect(response.status).toBe(200);
    expect(response.data.ok).toBe(true);
    expect(response.data.data._id).toBe(productId);
  });

  // PROD-04: rechazar un producto sin nombre.
  test('PROD-04 - Rechazar producto sin nombre', async () => {
    const category = createValidCategory();
    const categoryResponse = await httpClient.post(
      '/api/categories',
      category
    );

    categoryId = categoryResponse.data.data._id;

    const invalidProduct = {
      description: 'Producto sin nombre',
      price: 1500,
      image: 'https://example.com/producto.jpg',
      category: categoryId
    };

    const response = await httpClient.post(
      '/api/products',
      invalidProduct
    );

    expect(response.status).toBe(400);
    expect(response.data.ok).toBe(false);
  });

  // PROD-05: rechazar un producto con categoría inválida.
  test('PROD-05 - Rechazar categoría inválida', async () => {
    const invalidProduct = createValidProduct(
      '000000000000000000000000'
    );

    const response = await httpClient.post(
      '/api/products',
      invalidProduct
    );

    expect(response.status).toBe(404);
    expect(response.data.ok).toBe(false);
  });
});