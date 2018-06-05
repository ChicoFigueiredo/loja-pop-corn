var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index2', function(req, res, next) {
    res.render('index', { title: 'CL Benefícios de ' + req.hostname });
});


module.exports = router;