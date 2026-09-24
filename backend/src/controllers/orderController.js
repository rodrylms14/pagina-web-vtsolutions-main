const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Crear orden
const createOrder = async (req, res) => {
  try {
    const { user, products, total, status } = req.body;

    if (!user || !products || !Array.isArray(products) || products.length === 0 || total == null) {
      return res.status(400).json({
        ok: false,
        message: 'Debe enviar user, products y total'
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

    const newOrder = new Order({
      user,
      products,
      total,
      status: status || 'pendiente'
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      ok: true,
      message: 'Orden creada correctamente',
      data: savedOrder
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al crear orden',
      error: error.message
    });
  }
};

// Obtener órdenes por usuario
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate('user')
      .populate('products.product');

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontraron órdenes para este usuario'
      });
    }

    return res.status(200).json({
      ok: true,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener órdenes',
      error: error.message
    });
  }
};

// Actualizar orden
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { products, total, status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Orden no encontrada'
      });
    }

    if (products) {
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          ok: false,
          message: 'Products debe ser un arreglo válido'
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

      order.products = products;
    }

    if (total != null) {
      order.total = total;
    }

    if (status) {
      order.status = status;
    }

    const updatedOrder = await order.save();

    return res.status(200).json({
      ok: true,
      message: 'Orden actualizada correctamente',
      data: updatedOrder
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar orden',
      error: error.message
    });
  }
};

// Eliminar orden
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        ok: false,
        message: 'Orden no encontrada'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Orden eliminada correctamente',
      data: deletedOrder
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar orden',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  updateOrder,
  deleteOrder
};
