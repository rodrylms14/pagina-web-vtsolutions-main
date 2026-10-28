// Cliente HTTP reutilizable configurado con Axios.
// Permite enviar solicitudes al backend.
const httpClient = require('../clients/httpClient');

// Función que genera los datos válidos de una categoría.
const { createValidCategory } = require('../data/categoryData');

// Agrupa todos los casos relacionados con el recurso categorías.
describe('Pruebas funcionales de categorías', () => {
  // Variable que almacenará el ID de la categoría creada.
  let categoryId;

  // Se ejecuta después de cada prueba para limpiar los datos creados.
  afterEach(async () => {
    // Solo elimina si existe un ID válido.
    if (categoryId) {
      const response = await httpClient.delete(
        `/api/categories/${categoryId}`
      );

      // La eliminación debe responder con código 200.
      expect(response.status).toBe(200);

      // Reiniciar la variable para la siguiente prueba.
      categoryId = undefined;
    }
  });

  // Caso CAT-01: crear una categoría válida.
  test('CAT-01 - Crear categoría correctamente', async () => {
    // Preparar los datos de entrada.
    const category = createValidCategory();

    // Enviar la solicitud POST al backend.
    const response = await httpClient.post(
      '/api/categories',
      category
    );

    // Guardar el ID generado por MongoDB.
    categoryId = response.data.data?._id;

    // Validar la respuesta.
    expect(response.status).toBe(201);
    expect(response.data.ok).toBe(true);
    expect(response.data.data).toHaveProperty('_id');
    expect(response.data.data.name).toBe(category.name);
  });

  // Caso CAT-02: consultar la lista de categorías.
  test('CAT-02 - Consultar categorías correctamente', async () => {
    // Crear una categoría temporal.
    const category = createValidCategory();

    // Registrar la categoría mediante POST.
    const createResponse = await httpClient.post(
      '/api/categories',
      category
    );

    // Guardar su ID para eliminarla al finalizar.
    categoryId = createResponse.data.data?._id;

    // Consultar todas las categorías.
    const response = await httpClient.get('/api/categories');

    // Validar la respuesta.
    expect(response.status).toBe(200);
    expect(response.data.ok).toBe(true);
    expect(Array.isArray(response.data.data)).toBe(true);

    // Confirmar que la categoría creada aparece en la lista.
    const categoryExists = response.data.data.some(
      (item) => item._id === categoryId
    );

    expect(categoryExists).toBe(true);
  });
    // Caso CAT-03: comprobar que el backend rechaza
  // una categoría sin nombre.
  test('CAT-03 - Rechazar categoría sin nombre', async () => {
    // Enviar un objeto vacío, sin el campo obligatorio name.
    const response = await httpClient.post(
      '/api/categories',
      {}
    );

    // 400 significa que los datos enviados son inválidos.
    expect(response.status).toBe(400);

    // El backend debe indicar que la operación no fue exitosa.
    expect(response.data.ok).toBe(false);

    // Verificar que el mensaje explique el problema.
    expect(response.data.message).toContain('nombre');
  });
    // Caso CAT-04: comprobar que una categoría se puede actualizar.
  test('CAT-04 - Actualizar categoría correctamente', async () => {
    // Crear una categoría inicial.
    const category = createValidCategory();

    const createResponse = await httpClient.post(
      '/api/categories',
      category
    );

    // Guardar el ID de la categoría creada.
    categoryId = createResponse.data.data?._id;

    // Definir el nuevo nombre.
    const updatedCategory = {
      name: `Categoría actualizada ${Date.now()}`
    };

    // Enviar la solicitud PUT para actualizarla.
    const response = await httpClient.put(
      `/api/categories/${categoryId}`,
      updatedCategory
    );

    // Validar la respuesta.
    expect(response.status).toBe(200);
    expect(response.data.ok).toBe(true);
    expect(response.data.data.name).toBe(updatedCategory.name);
  });

  // Caso CAT-05: comprobar que una categoría se puede eliminar.
  test('CAT-05 - Eliminar categoría correctamente', async () => {
    // Crear una categoría temporal.
    const category = createValidCategory();

    const createResponse = await httpClient.post(
      '/api/categories',
      category
    );

    // Guardar el ID creado.
    categoryId = createResponse.data.data?._id;

    // Eliminar la categoría.
    const response = await httpClient.delete(
      `/api/categories/${categoryId}`
    );

    // Validar que la eliminación fue exitosa.
    expect(response.status).toBe(200);
    expect(response.data.ok).toBe(true);

    // La categoría ya fue eliminada manualmente,
    // por eso evitamos que afterEach intente eliminarla otra vez.
    categoryId = undefined;
  });
});