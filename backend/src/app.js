const express = require('express');
const cors = require('cors');

const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const externalRoutes = require('./routes/externalRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/external', externalRoutes);

module.exports = app;