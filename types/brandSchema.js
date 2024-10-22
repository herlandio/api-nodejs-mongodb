const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Brand schema definition
 * @type {mongoose.Schema}
 */
const brandSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        required: true
    },
    name: {
        type: String,
        required: [true, 'What is the name of the brand?']
    }
}, {
    collection: 'brands',
    versionKey: false
});

brandSchema.index({ name: 'text' });

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
