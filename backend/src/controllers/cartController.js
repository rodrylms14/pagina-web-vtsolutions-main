const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const createCart = async (req, res) => {
  try {
    const { user, products } = req.body;

    if (!user || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Debe enviar user y un arreglo de products'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del usuario no es válido'
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
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          ok: false,
          message: 'El ID de uno de los productos no es válido'
        });
      }

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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del usuario no es válido'
      });
    }

    const cart = await Cart.findOne({ user: userId })
      .populate('user', '-password')
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del carrito no es válido'
      });
    }

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
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          ok: false,
          message: 'El ID de uno de los productos no es válido'
        });
      }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del carrito no es válido'
      });
    }

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

// Actualizar cantidad de un producto del carrito
const updateItemQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del usuario o producto no es válido'
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        ok: false,
        message: 'La cantidad debe ser un número entero mayor o igual a 1'
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: 'Carrito no encontrado'
      });
    }

    const item = cart.products.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado en el carrito'
      });
    }

    item.quantity = quantity;

    const updatedCart = await cart.save();

    return res.status(200).json({
      ok: true,
      message: 'Cantidad actualizada correctamente',
      data: updatedCart
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar la cantidad',
      error: error.message
    });
  }
};

// Eliminar un producto específico del carrito
const removeItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del usuario o producto no es válido'
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: 'Carrito no encontrado'
      });
    }

    const productExists = cart.products.some(
      item => item.product.toString() === productId
    );

    if (!productExists) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado en el carrito'
      });
    }

    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );

    const updatedCart = await cart.save();

    return res.status(200).json({
      ok: true,
      message: 'Producto eliminado del carrito correctamente',
      data: updatedCart
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar el producto del carrito',
      error: error.message
    });
  }
};

module.exports = {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart,
  updateItemQuantity,
  removeItemFromCart
};