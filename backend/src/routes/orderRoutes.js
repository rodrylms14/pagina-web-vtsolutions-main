const express = require('express');
const {
  createOrder,
  getOrdersByUserId,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

// Crear orden
router.post('/', createOrder);

// Obtener órdenes por usuario
router.get('/:userId', getOrdersByUserId);

// Actualizar orden
router.put('/:id', updateOrder);

// Eliminar orden
router.delete('/:id', deleteOrder);

module.exports = router;