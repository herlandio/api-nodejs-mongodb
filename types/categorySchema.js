const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Category schema definition
 * @type {mongoose.Schema}
 */
const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        required: true
    },
    name: {
        type: String,
        required: [true, 'What is the category?']
    },
    description: {
        type: String,
        required: [true, 'Description of the category?']
    }
}, {
    collection: 'categories',
    versionKey: false
});

categorySchema.index({ name: 'text', description: 'text' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
