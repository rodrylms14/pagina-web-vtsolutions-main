const express = require('express');
const {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart
} = require('../controllers/cartController');

const router = express.Router();

router.post('/', createCart);
router.get('/:userId', getCartByUserId);
router.put('/:id', updateCart);
router.delete('/:id', deleteCart);

module.exports = router;