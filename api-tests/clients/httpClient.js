const axios = require('axios');
const { API_BASE_URL } = require('../config/apiConfig');

const httpClient = axios.create({ 
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: () => true
});

module.exports = httpClient;