const mongoose = require('mongoose');

/**
 * Tipos de dados e tratamento
 * @type {mongoose.Schema}
 */
const categorySchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: [true, 'Qual a categoria?']
    },
    description: {
        type: String,
        required: [true, 'Descrição da categoria?']
    }
},{
    collection:'categories',
    versionKey: false
});

let Category = mongoose.model('category', categorySchema);

module.exports = Category;