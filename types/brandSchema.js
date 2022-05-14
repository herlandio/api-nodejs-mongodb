const mongoose = require('mongoose');

/**
 * Tipos de dados e tratamento
 * @type {mongoose.Schema}
 */
const brandSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: [true, 'Qual o nome da marca?']
    }
},{
    collection:'brands',
    versionKey: false
});

const Brand = mongoose.model('brand', brandSchema);

module.exports = Brand;