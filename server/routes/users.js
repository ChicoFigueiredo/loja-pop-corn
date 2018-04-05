var express = require('express');
var router = express.Router();
var model = require('../model/model');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });


router.post("/api/SaveUser", function(req, res) {
    var mod = new model(req.body);
    if (req.body.mode == "Save") {
        mod.save(function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send({ data: "Record has been Inserted..!!" });
            }
        });
    } else {
        model.findByIdAndUpdate(req.body.id, { name: req.body.name, address: req.body.address },
            function(err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ data: "Record has been Updated..!!" });
                }
            });


    }
})

router.post("/api/deleteUser", function(req, res) {
    model.remove({ _id: req.body.id }, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send({ data: "Record has been Deleted..!!" });
        }
    });
})



router.get("/api/getUser", function(req, res) {
    model.find({}, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
})

module.exports = router;