const mongoose = require('mongoose');
const Float = mongoose.Schema.Types.Decimal128;

/**
 * Tipos de dados e tratamento
 * @type {mongoose.Schema}
 */
const productsSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: [true, 'Nome do produto?']
    },
    description: {
        type: String,
        required: [true, 'Descrição do produto?']
    },
    price: {
        type: Float,
        required: [true, 'Preço do produto?']
    },
    inventory: {
        type: Number,
        required: [true, 'Quantidade de produtos?']
    },
    category: {
        type: String,
        required: [true, 'Categoria do produto?']
    },
    brand: {
        type: String,
        required: [true, 'Marca do produto?']
    }
},{
    collection:'products',
    versionKey: false
});

const Products = mongoose.model('product', productsSchema);

module.exports = Products;