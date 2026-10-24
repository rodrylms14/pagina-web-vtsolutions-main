
const httpClient = require('../clients/httpClient');
const { createValidUser } = require('../data/authData');

describe('Pruebas funcionales de autenticación', () => {
  const registerUrl = '/api/auth/register';
  const loginUrl = '/api/auth/login';

  // AUTH-01: Registro exitoso
  test('AUTH-01 - Registrar usuario correctamente', async () => {
    const user = createValidUser();
    const response = await httpClient.post(registerUrl, user);

    expect(response.status).toBe(201);
    expect(response.data.ok).toBe(true);
    expect(response.data.data.email).toBe(user.email);
    expect(response.data.data).toHaveProperty('id');
  });

  // AUTH-02: Registro sin nombre
  test('AUTH-02 - Rechazar registro sin nombre', async () => {
    const { name, ...user } = createValidUser();
    const response = await httpClient.post(registerUrl, user);

    expect(response.status).toBe(400);
    expect(response.data.ok).toBe(false);
  });

  // AUTH-03: Registro sin correo
  test('AUTH-03 - Rechazar registro sin correo', async () => {
    const { email, ...user } = createValidUser();
    const response = await httpClient.post(registerUrl, user);

    expect(response.status).toBe(400);
    expect(response.data.ok).toBe(false);
  });

  // AUTH-04: Registro sin contraseña
  test('AUTH-04 - Rechazar registro sin contraseña', async () => {
    const { password, ...user } = createValidUser();
    const response = await httpClient.post(registerUrl, user);

    expect(response.status).toBe(400);
    expect(response.data.ok).toBe(false);
  });

  // AUTH-05: Correo duplicado
  test('AUTH-05 - Rechazar correo registrado', async () => {
    const user = createValidUser();

    const first = await httpClient.post(registerUrl, user);
    expect(first.status).toBe(201);

    const response = await httpClient.post(registerUrl, user);

    expect(response.status).toBe(409);
    expect(response.data.ok).toBe(false);
  });

  // AUTH-06: Inicio de sesión exitoso
  test('AUTH-06 - Iniciar sesión correctamente', async () => {
    const user = createValidUser();

    const registration = await httpClient.post(registerUrl, user);
    expect(registration.status).toBe(201);

    const response = await httpClient.post(loginUrl, {
      email: user.email,
      password: user.password
    });

    expect(response.status).toBe(200);
    expect(response.data.ok).toBe(true);
    expect(response.data.data.email).toBe(user.email);
  });

  // AUTH-07: Login sin correo
  test('AUTH-07 - Rechazar login sin correo', async () => {
    const response = await httpClient.post(loginUrl, {
      password: 'Test123456'
    });

    expect(response.status).toBe(400);
    expect(response.data.ok).toBe(false);
  });

  // AUTH-08: Login sin contraseña
  test('AUTH-08 - Rechazar login sin contraseña', async () => {
    const response = await httpClient.post(loginUrl, {
      email: createValidUser().email
    });

    expect(response.status).toBe(400);
    expect(response.data.ok).toBe(false);
  });

  // AUTH-09: Usuario inexistente
  test('AUTH-09 - Rechazar usuario inexistente', async () => {
    const user = createValidUser();

    const response = await httpClient.post(loginUrl, {
      email: user.email,
      password: user.password
    });

    expect(response.status).toBe(404);
    expect(response.data.ok).toBe(false);
  });

  // AUTH-10: Contraseña incorrecta
  test('AUTH-10 - Rechazar contraseña incorrecta', async () => {
    const user = createValidUser();

    const registration = await httpClient.post(registerUrl, user);
    expect(registration.status).toBe(201);

    const response = await httpClient.post(loginUrl, {
      email: user.email,
      password: 'ContrasenaIncorrecta'
    });

    expect(response.status).toBe(401);
    expect(response.data.ok).toBe(false);
  });
});
