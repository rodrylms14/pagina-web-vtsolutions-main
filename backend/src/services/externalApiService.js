const fetchExternalProducts = async () => {
    const respuesta = await fetch('https://dummyjson.com/products');
    const data = await respuesta.json();
    return data.products;
};

module.exports = {
    fetchExternalProducts
};