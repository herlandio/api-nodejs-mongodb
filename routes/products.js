var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Product = require('../types/productsSchema');
const {success, fail} = require('../help/messages');

/**
 * Criação de produtos
 */
router.post('/create', function (req, res) {
    const { name, description, price, inventory, category, brand } = req.body;
    const boxError = [];

    const product = new Product();
    product._id = uuidv4();
    product.name = name;
    product.description = description;
    product.price = price;
    product.inventory = inventory;
    product.category = category;
    product.brand = brand;

    product.save(function (err) {
        if (err) {
            for(let field in err.errors) {
                boxError.push({field: err.errors[field].message});
            }
            fail(res, boxError, 400, 'bad request');
        } else {
            success(res, {
                name: name,
                description: description,
                price: price,
                inventory: inventory,
                category: category,
                brand: brand
            }, 201, 'success', 'created');
        }
    });
});

/**
 * Edição de produtos
 */
router.put('/edit/:id', async function (req, res) {
    const { name, description, price, inventory, category, brand } = req.body;
    const { id } = req.params;

    const UptProduct = await Product.findById(id);
    UptProduct.name = name;
    UptProduct.description = description;
    UptProduct.price = price;
    UptProduct.inventory = inventory;
    UptProduct.category = category;
    UptProduct.brand = brand;

    await UptProduct.save().then(edited => {
        if (edited === UptProduct) {
            success(res, {
                name: name,
                description: description,
                price: price,
                inventory: inventory,
                category: category,
                brand: brand
            }, 200, 'success', 'updated');
        }
    });
});

/**
 * Remoção de produtos
 */
router.delete('/delete/:id', function (req, res) {
    const { id } = req.params;

    Product.findByIdAndDelete(id, function () {
        success(res, '', 200, 'success', 'deleted');
    });
});

/**
 * Listagem de produtos
 */
router.get('/list', async function(req, res) {
    success(res, await Product.find(), 200, 'success', 'listed');
});

/**
 * Busca e filtro de produtos
 */
router.get('/list/:search', async function(req, res) {
    const { name, description, category, brand } = req.query;
    const { search } = req.params;
    let searchByText = {};

    if (req.params.search === 'filter') {
        searchByText = {
            name: { $regex: new RegExp(name), $options: 'i' },
            description: { $regex: new RegExp(description), $options: 'i' },
            category: { $regex: new RegExp(category), $options: 'i' },
            brand: { $regex: new RegExp(brand), $options: 'i' },
        };
    } else {
        searchByText = { $text: { $search: search } };
    }
    success(res, await Product.find(searchByText), 200, 'success', 'listed');
});

module.exports = router;
