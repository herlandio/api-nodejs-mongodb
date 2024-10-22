var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Category = require('../types/categorySchema');
const { success, fail } = require('../help/messages');

/**
 * Creates a category
 */
router.post('/create', async function (req, res) {
    const { name, description } = req.body;
    const boxError = [];

    if (!name || !description) {
        /*
        * #swagger.responses[400]
        */
        return fail(res, 'Name and description are required', 400, 'bad request');
    }

    const category = new Category({
        _id: uuidv4(),
        name,
        description
    });

    try {
        await category.save();
        /*
        * #swagger.responses[201]
        */
        success(res, category, 201, 'success', 'created');
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
 * Edits a category
 */
router.put('/edit/:id', async function (req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const UptCategory = await Category.findById(id);
        if (!UptCategory) {
            /*
            * #swagger.responses[404]
            */
            return fail(res, 'Category not found', 404, 'not found');
        }

        UptCategory.name = name || UptCategory.name;
        UptCategory.description = description || UptCategory.description;

        await UptCategory.save();
        /*
        * #swagger.responses[200]
        */
        success(res, UptCategory, 200, 'success', 'updated');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error updating category', 500, 'server error');
    }
});

/**
 * Deletes a category
 */
router.delete('/delete/:id', async function (req, res) {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            /*
            * #swagger.responses[404]
            */
            return fail(res, 'Category not found', 404, 'not found');
        }
        /*
        * #swagger.responses[200]
        */
        success(res, '', 200, 'success', 'deleted');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error deleting category', 500, 'server error');
    }
});

/**
 * Lists all categories
 */
router.get('/list', async function(req, res) {
    try {
        const categories = await Category.find();
        /*
        * #swagger.responses[200]
        */
        success(res, categories, 200, 'success', 'listed');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error listing categories', 500, 'server error');
    }
});

/**
 * Searches or filters categories
 */
router.get('/list/:search', async function(req, res) {
    const { search } = req.params;
    const { name, description } = req.query;
    let searchByText = {};

    try {
        if (search === 'filter') {
            searchByText = {
                ...(name && { name: { $regex: new RegExp(name, 'i') } }),
                ...(description && { description: { $regex: new RegExp(description, 'i') } })
            };
        } else {
            searchByText = { $text: { $search: search } };
        }

        const categories = await Category.find(searchByText);

        if (categories.length === 0) {
            /*
            * #swagger.responses[404]
            */
            return fail(res, 'No categories found', 404, 'not found');
        }
        /*
        * #swagger.responses[200]
        */
        success(res, categories, 200, 'success', 'listed');
    } catch (err) {
        console.error("Error searching categories:", err);
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error searching categories', 500, 'server error');
    }
});

module.exports = router;
