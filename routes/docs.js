var express = require('express');
var router = express.Router();

router.get('/api', function (req, res) {
    res.send('ok');
});

module.exports = router;
