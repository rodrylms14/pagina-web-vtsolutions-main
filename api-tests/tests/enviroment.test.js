const { API_BASE_URL } = require('../config/apiConfig');

describe('Configuración del entorno de pruebas', () => {
  test('Debe utilizar el servidor de pruebas en el puerto 4001', () => {
    expect(new URL(API_BASE_URL).port).toBe('4001');
  });
});