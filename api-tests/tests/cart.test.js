const http = require('../clients/httpClient');
const { cartData, absentId } = require('../data/catalogData');
const { createTestData, expectError } = require('../utils/testData');

describe('Persona 3 - Carrito', () => {
  let data;
  beforeEach(() => { data = createTestData(); });
  afterEach(async () => { await data.cleanup(); });

  test('P3-CAR-01 - Crear carrito con usuario y producto reales', async () => {
    const { user, product } = await data.basket();
    const cart = await data.cart(user.id, product._id);
    expect(cart.user).toBe(user.id);
    expect(cart.products).toEqual([{ _id: expect.stringMatching(/^[a-f\d]{24}$/), product: product._id, quantity: 2 }]);
  });
  test('P3-CAR-02 - Rechazar carrito sin usuario', async () => {
    expectError(await http.post('/api/cart', { products: [{ product: absentId(), quantity: 1 }] }), 400, 'Debe enviar user y un arreglo de products');
  });
  test('P3-CAR-03 - Rechazar carrito con productos vacíos', async () => {
    const user = await data.user();
    expectError(await http.post('/api/cart', { user: user.id, products: [] }), 400, 'Debe enviar user y un arreglo de products');
  });
  test('P3-CAR-04 - Rechazar carrito de usuario inexistente', async () => {
    expectError(await http.post('/api/cart', cartData(absentId(), absentId())), 404, 'Usuario no encontrado');
  });
  test('P3-CAR-05 - Rechazar ID de producto malformado', async () => {
    const user = await data.user();
    expectError(await http.post('/api/cart', cartData(user.id, 'invalid')), 400, 'El ID de uno de los productos no es válido');
  });
  test('P3-CAR-06 - Rechazar producto inexistente', async () => {
    const user = await data.user();
    const id = absentId();
    expectError(await http.post('/api/cart', cartData(user.id, id)), 404, `Producto no encontrado: ${id}`);
  });
  test('P3-CAR-07 - Consultar carrito poblado sin contraseña', async () => {
    const { user, product } = await data.basket();
    const cart = await data.cart(user.id, product._id);
    const response = await http.get(`/api/cart/${user.id}`);
    expect(response.status).toBe(200);
    expect(response.data.ok).toBe(true);
    expect(response.data.data._id).toBe(cart._id);
    expect(response.data.data.user).toMatchObject({ _id: user.id, email: user.email });
    expect(response.data.data.user).not.toHaveProperty('password');
    expect(response.data.data.products[0]).toMatchObject({ quantity: 2, product: { _id: product._id, price: product.price, name: product.name } });
  });
  test('P3-CAR-09 - Rechazar consulta con ID malformado', async () => {
    expectError(await http.get('/api/cart/invalid'), 400, 'El ID del usuario no es válido');
  });
  test('P3-CAR-10 - Reemplazar productos y persistir cantidad', async () => {
    const { user, product } = await data.basket();
    const cart = await data.cart(user.id, product._id);
    const response = await http.put(`/api/cart/${cart._id}`, { products: [{ product: product._id, quantity: 4 }] });
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({ ok: true, message: 'Carrito actualizado correctamente', data: { _id: cart._id, user: user.id, products: [{ product: product._id, quantity: 4 }] } });
    const saved = await http.get(`/api/cart/${user.id}`);
    expect(saved.status).toBe(200);
    expect(saved.data.data.products[0].quantity).toBe(4);
  });
  test('P3-CAR-12 - Actualizar cantidad de un producto', async () => {
    const { user, product } = await data.basket();
    const cart = await data.cart(user.id, product._id);
    const response = await http.put(`/api/cart/${user.id}/item/${product._id}`, { quantity: 3 });
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({ ok: true, message: 'Cantidad actualizada correctamente', data: { _id: cart._id, products: [{ product: product._id, quantity: 3 }] } });
    const saved = await http.get(`/api/cart/${user.id}`);
    expect(saved.status).toBe(200);
    expect(saved.data.data.products[0].quantity).toBe(3);
  });
});
