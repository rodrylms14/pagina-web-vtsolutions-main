const { randomUUID } = require('node:crypto');

function createValidUser() {
  const uniqueId = randomUUID();

  return {
    name: 'Usuario Prueba',
    email: `test_${uniqueId}@example.com`,
    password: 'Test123456'
  };
}

module.exports = {
  createValidUser
};