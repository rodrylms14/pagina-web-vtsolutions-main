const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

const createCart = async (req, res) => {
  try {
    const { user, products } = req.body;

    if (!user || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Debe enviar user y un arreglo de products'
      });
    }

    const userExists = await User.findById(user);

    if (!userExists) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    for (const item of products) {
      const productExists = await Product.findById(item.product);

      if (!productExists) {
        return res.status(404).json({
          ok: false,
          message: `Producto no encontrado: ${item.product}`
        });
      }
    }

    const newCart = new Cart({ user, products });
    const savedCart = await newCart.save();

    return res.status(201).json({
      ok: true,
      message: 'Carrito creado correctamente',
      data: savedCart
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear carrito',
      error: error.message
    });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId })
      .populate('user')
      .populate('products.product');

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: 'Carrito no encontrado para este usuario'
      });
    }

    return res.status(200).json({
      ok: true,
      data: cart
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener carrito',
      error: error.message
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Debe enviar un arreglo de products'
      });
    }

    const cart = await Cart.findById(id);

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: 'Carrito no encontrado'
      });
    }

    for (const item of products) {
      const productExists = await Product.findById(item.product);

      if (!productExists) {
        return res.status(404).json({
          ok: false,
          message: `Producto no encontrado: ${item.product}`
        });
      }
    }

    cart.products = products;

    const updatedCart = await cart.save();

    return res.status(200).json({
      ok: true,
      message: 'Carrito actualizado correctamente',
      data: updatedCart
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar carrito',
      error: error.message
    });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCart = await Cart.findByIdAndDelete(id);

    if (!deletedCart) {
      return res.status(404).json({
        ok: false,
        message: 'Carrito no encontrado'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Carrito eliminado correctamente',
      data: deletedCart
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar carrito',
      error: error.message
    });
  }
};

module.exports = {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart
};