var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Brand = require('../types/brandSchema');
const {success, fail} = require('../help/messages');

/**
 * Creates a brand
 */
router.post('/create', async function (req, res) {
    const { name } = req.body;
    const boxError = [];

    if (!name) {

        /*
        * #swagger.responses[400]
        */
        return fail(res, 'Brand name is required', 400, 'bad request');
    }

    const brand = new Brand({
        _id: uuidv4(),
        name
    });

    try {
        await brand.save();
        /*
        * #swagger.responses[201]
        */
        success(res, brand, 201, 'success', 'created');
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
 * Edits a brand
 */
router.put('/edit/:id', async function (req, res) {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        /*
        * #swagger.responses[400]
        */
        return fail(res, 'Brand name is required', 400, 'bad request');
    }

    try {
        const UptBrand = await Brand.findById(id);
        if (!UptBrand) {
            /*
            * #swagger.responses[404]
            */
            return fail(res, 'Brand not found', 404, 'not found');
        }

        UptBrand.name = name;
        await UptBrand.save();
        /*
        * #swagger.responses[200]
        */
        success(res, UptBrand, 200, 'success', 'updated');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error updating brand', 500, 'server error');
    }
});

/**
 * Deletes a brand
 */
router.delete('/delete/:id', async function (req, res) {
    const { id } = req.params;

    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);
        if (!deletedBrand) {
            /*
            * #swagger.responses[404]
            */
            return fail(res, 'Brand not found', 404, 'not found');
        }
        /*
        * #swagger.responses[200]
        */
        success(res, '', 200, 'success', 'deleted');
    } catch (err) {
        fail(res, 'Error deleting brand', 500, 'server error');
    }
});

/**
 * Lists all brands
 */
router.get('/list', async function(req, res) {
    try {
        const brands = await Brand.find();
        /*
        * #swagger.responses[200]
        */
        success(res, brands, 200, 'success', 'listed');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error listing brands', 500, 'server error');
    }
});

/**
 * Searches for brands
 */
router.get('/list/:search', async function(req, res) {
    const { search } = req.params;

    try {
        let searchByText = { $text: { $search: search } };
        const brands = await Brand.find(searchByText);
        /*
        * #swagger.responses[200]
        */
        success(res, brands, 200, 'success', 'listed');
    } catch (err) {
        /*
        * #swagger.responses[500]
        */
        fail(res, 'Error searching for brands', 500, 'server error');
    }
});

module.exports = router;

