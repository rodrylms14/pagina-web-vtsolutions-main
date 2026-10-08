const Category = require('../models/Category');
const mongoose = require('mongoose');

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({
      ok: true,
      data: categories
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

// Crear una categoría
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: 'El nombre de la categoría es obligatorio'
      });
    }

    const newCategory = new Category({
      name
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      ok: true,
      message: 'Categoría creada correctamente',
      data: savedCategory
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

// Actualizar una categoría
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validar formato del ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID de la categoría no es válido'
      });
    }

    // Validar nombre
    if (!name) {
      return res.status(400).json({
        ok: false,
        message: 'El nombre de la categoría es obligatorio'
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        ok: false,
        message: 'Categoría no encontrada'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Categoría actualizada correctamente',
      data: updatedCategory
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar categoría',
      error: error.message
    });
  }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar formato del ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID de la categoría no es válido'
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        ok: false,
        message: 'Categoría no encontrada'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Categoría eliminada correctamente',
      data: deletedCategory
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar categoría',
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};