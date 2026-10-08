const express = require('express');
const {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart,
  updateItemQuantity,
  removeItemFromCart
} = require('../controllers/cartController');

const router = express.Router();

router.post('/', createCart);
router.get('/:userId', getCartByUserId);
router.put('/:id', updateCart);
router.put('/:userId/item/:productId', updateItemQuantity);
router.delete('/:id', deleteCart);
router.delete('/:userId/item/:productId', removeItemFromCart);


module.exports = router;