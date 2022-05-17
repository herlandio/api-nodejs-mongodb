var express = require('express');
var router = express.Router();

router.post('/api', function (req, res) {
    return res.send('ok');
});