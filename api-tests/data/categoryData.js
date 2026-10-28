const { randomUUID } = require('node:crypto');

function createValidCategory() {
  return {
    name: `Categoria de prueba ${randomUUID()}`
  };
}

module.exports = {
  createValidCategory
};