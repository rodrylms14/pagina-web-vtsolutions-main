// Se carga únicamente al ejecutar run-entrega.js con --fallo-controlado.
// Demuestra que Jest transmite una assertion fallida al pipeline.
test('CI - fallo intencional para validar propagación de errores', () => {
  expect(200).toBe(201);
});
