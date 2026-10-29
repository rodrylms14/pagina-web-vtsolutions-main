module.exports = {
  ...require('./package.json').jest,
  testTimeout: 15000,
  testMatch: [
    '<rootDir>/tests/auth.test.js', '<rootDir>/tests/categories.test.js',
    '<rootDir>/tests/products.test.js', '<rootDir>/tests/cart.test.js'
  ]
};
