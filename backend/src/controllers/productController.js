const Product = require('../models/Product');
const Category = require('../models/Category');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');

    return res.status(200).json({
      ok: true,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('category');

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado'
      });
    }

    return res.status(200).json({
      ok: true,
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener el producto',
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || !description || price == null || !image || !category) {
      return res.status(400).json({
        ok: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        ok: false,
        message: 'Categoría no encontrada'
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      ok: true,
      message: 'Producto creado correctamente',
      data: savedProduct
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado'
      });
    }

    if (category) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          ok: false,
          message: 'Categoría no encontrada'
        });
      }
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.image = image ?? product.image;
    product.category = category ?? product.category;

    const updatedProduct = await product.save();

    return res.status(200).json({
      ok: true,
      message: 'Producto actualizado correctamente',
      data: updatedProduct
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Producto eliminado correctamente',
      data: deletedProduct
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};