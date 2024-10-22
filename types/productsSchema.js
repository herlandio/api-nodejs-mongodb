const mongoose = require('mongoose');
const Float = mongoose.Schema.Types.Decimal128;
const { v4: uuidv4 } = require('uuid');

/**
 * Product schema definition
 * @type {mongoose.Schema}
 */
const productSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Product name?']
    },
    description: {
        type: String,
        required: [true, 'Product description?']
    },
    price: {
        type: Float,
        required: [true, 'Product price?']
    },
    inventory: {
        type: Number,
        required: [true, 'Quantity of products?']
    },
    category: {
        type: String,
        required: [true, 'Product category?']
    },
    brand: {
        type: String,
        required: [true, 'Product brand?']
    }
}, {
    collection: 'products',
    versionKey: false
});

productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
