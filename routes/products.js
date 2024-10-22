var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Product = require('../types/productsSchema');
const { success, fail } = require('../help/messages');

/**
 * Creates a product
 */
router.post('/create', async function (req, res) {
    const { name, description, price, inventory, category, brand } = req.body;
    const boxError = [];

    if (!name || !description || !price || !inventory || !category || !brand) {
        /*
        * #swagger.responses[400]
        */
        return fail(res, 'All fields are required', 400, 'bad request');
    }

    const product = new Product({
        _id: uuidv4(),
        name,
        description,
        price,
        inventory: Number(inventory),
        category,
        brand
    });

    try {
        await product.save();
        /*
        * #swagger.responses[201]
        */
        success(res, product, 201, 'success', 'created');
    } catch (err) {
        for (let field in err.errors) {
            boxError.push({ field: err.errors[field].message });
        }
        /*
        * #swagger.responses[400]
        */
        fail(res, boxError, 400, 'bad request');
    }
});

/**
 * Edits a product
 */
router.put('/edit/:id', async function (req, res) {
    const { id } = req.params;
    const { name, description, price, inventory, category, brand } = req.body;

    try {
        const UptProduct = await Product.findById(id);
        if (!UptProduct) {
            /*
            * #swagger.responses[404]
            */
            return fail(res, 'Product not found', 404, 'not found');
        }

        UptProduct.name = name || UptProduct.name;
        UptProduct.description = description || UptProduct.description;
        UptProduct.price = price !== undefined ? price : UptProduct.price;
        UptProduct.inventory = inventory !== undefined ? inventory : UptProduct.inventory;
        UptProduct.category = category || UptProduct.category;
        UptProduct.brand = brand || UptProduct.brand;

        await UptProduct.save();
        /*
        * #swagger.responses[200]
        */
        success(res, UptProduct, 200, 'success', 'updated');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error updating product', 500, 'server error');
    }
});

/**
 * Deletes a product
 */
router.delete('/delete/:id', async function (req, res) {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            /*
            * #swagger.responses[404]
            */
            return fail(res, 'Product not found', 404, 'not found');
        }
        /*
        * #swagger.responses[200]
        */
        success(res, '', 200, 'success', 'deleted');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error deleting product', 500, 'server error');
    }
});

/**
 * Lists all products
 */
router.get('/list', async function (req, res) {
    try {
        const products = await Product.find();
        /*
        * #swagger.responses[200]
        */
        success(res, products, 200, 'success', 'listed');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error listing products', 500, 'server error');
    }
});

/**
 * Searches or filters products
 */
router.get('/list/:search', async function (req, res) {
    const { search } = req.params;
    const { name, description, category, brand } = req.query;
    let searchByText = {};

    try {
        if (search === 'filter') {
            searchByText = {
                ...(name && { name: { $regex: new RegExp(name, 'i') } }),
                ...(description && { description: { $regex: new RegExp(description, 'i') } }),
                ...(category && { category: { $regex: new RegExp(category, 'i') } }),
                ...(brand && { brand: { $regex: new RegExp(brand, 'i') } }),
            };
        } else {
            searchByText = { $text: { $search: search } };
        }

        const products = await Product.find(searchByText);
        /*
        * #swagger.responses[200]
        */
        success(res, products, 200, 'success', 'listed');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error searching products', 500, 'server error');
    }
});

module.exports = router;
