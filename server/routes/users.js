var express = require('express');
var router = express.Router();
var users = require('../model/users');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });


router.post("/save", function(req, res) {
    var mod = new users(req.body);
    if (req.body.mode == "Save") {
        mod.save(function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send({ data: "Record has been Inserted..!!" });
            }
        });
    } else {
        users.findByIdAndUpdate(req.body.id, { name: req.body.name, address: req.body.address },
            function(err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ data: "Record has been Updated..!!" });
                }
            });


    }
})

router.post("/delete", function(req, res) {
    users.remove({ _id: req.body.id }, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send({ data: "Record has been Deleted..!!" });
        }
    });
})



router.get("/list", function(req, res) {
    users.find({}, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
})

router.get("/sample", function(req, res) {
    var u = new users({
        name: req.query.nome,
        address: req.query.endereco,
        link: req.query.link,
    });
    u.save(function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send({ data: "Record has been Inserted..!!" });
        }
    });
})

module.exports = router;