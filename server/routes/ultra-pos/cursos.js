var express = require('express');
var router = express.Router();


router.get("/list", function(req, res) {
    var cursos = require('../../model/ultra-pos/cursos')(req.hostname);
    cursos.find({ published: true }, { _id: false, id: true, name: true, 'categories.id': true, 'variants': true, 'codigo_vindi': true }, //, 'categories.name.pt': true
        function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
});


module.exports = router;