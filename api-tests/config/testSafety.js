const { API_BASE_URL } = require('./apiConfig');

function validateTestEnvironment() {
  const url = new URL(API_BASE_URL);

  const allowedHosts = ['localhost', '127.0.0.1'];

  if (
    !allowedHosts.includes(url.hostname) ||
    url.port !== '4001' ||
    url.protocol !== 'http:'
  ) {
    throw new Error(
      'SEGURIDAD: Las pruebas solo pueden ejecutarse en http://localhost:4001 o http://127.0.0.1:4001'
    );
  }

  console.log('Entorno de pruebas autorizado:', API_BASE_URL);
}

module.exports = { validateTestEnvironment };