const { fetchExternalProducts } = require('../services/externalApiService');

const getExternalProducts = async (req, res) => {
    try {
        const products = await fetchExternalProducts();

        return res.status(200).json({
            ok: true,
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al consumir API externa',
            error: error.message
        });
    }
};

module.exports = {
    getExternalProducts
};