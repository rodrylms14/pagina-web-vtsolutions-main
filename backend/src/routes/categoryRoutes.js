const express = require('express');

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Obtener todas las categorías
router.get('/', getCategories);

// Crear una categoría
router.post('/', createCategory);

// Actualizar una categoría
router.put('/:id', updateCategory);

// Eliminar una categoría
router.delete('/:id', deleteCategory);

module.exports = router;