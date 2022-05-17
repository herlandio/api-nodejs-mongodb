var express = require('express');
var router = express.Router();

router.get('/api', function (req, res) {
    return res.send('ok');
});