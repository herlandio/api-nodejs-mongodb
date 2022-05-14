var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Category = require('../types/categorySchema');
const {success, fail} = require('../help/messages');

/**
 * Criação de categorias
 */
router.post('/create', function (req, res) {
    const { name, description } = req.body;
    const boxError = [];

    const category = new Category();
    category._id = uuidv4();
    category.name = name;
    category.description = description;

    category.save(function (err) {
        if (err) {
            for(let field in err.errors) {
                boxError.push({field: err.errors[field].message});
            }
            fail(res, boxError, 400, 'bad request');
        } else {
            success(res, {
                name: name,
                category: description
            }, 201, 'success', 'created');
        }
    });
});

/**
 * Edição de categorias
 */
router.put('/edit/:id', async function (req, res) {
    const { name, description } = req.body;
    const { id } = req.params;

    const UptCategory = await Category.findById(id);
    UptCategory.name = name;
    UptCategory.description = description;

    await UptCategory.save().then(edited => {
        if (edited === UptCategory) {
            success(res, {
                name: name,
                description: description
            }, 200, 'success', 'updated');
        }
    });
});

/**
 * Remoção de categorias
 */
router.delete('/delete/:id', function (req, res) {
    const { id } = req.params;

    Category.findByIdAndDelete(id, function () {
        success(res, '', 200, 'success', 'deleted');
    });
});

/**
 * Listagem de categorias
 */
router.get('/list', async function(req, res) {
    success(res, await Category.find(), 200, 'success', 'listed');
});

/**
 * Busca e filtro de categorias
 */
router.get('/list/:search', async function(req, res) {
    const { name, description } = req.query;
    const { search } = req.params;
    let searchByText = {};

    if (req.params.search === 'filter') {
        searchByText = {
            name: { $regex: new RegExp(name), $options: 'i' },
            description: { $regex: new RegExp(description), $options: 'i' }
        };
    } else {
        searchByText = { $text: { $search: search } };
    }
    success(res, await Category.find(searchByText), 200, 'success', 'listed');
});

module.exports = router;
