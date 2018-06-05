var express = require('express');
var router = express.Router();

router.get("/list", function(req, res) {
    var dbCupom = require('../../model/ultra-pos/cupom')(req.hostname);
    dbCupom.find({}, {}, //, 'categories.name.pt': true
        function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
})


router.get("/:banco/list", function(req, res) {
    var h = req.params.banco.replace(/db[_]pos[_]/gmi, '').replace(/[_]/gmi, '.');
    var dbCupom = require('../../model/ultra-pos/cupom')(h);
    dbCupom.find({}, {}, //, 'categories.name.pt': true
        function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
})


router.post("/:banco/save", function(req, res) {
    var h = req.params.banco.replace(/db[_]pos[_]/gmi, '').replace(/[_]/gmi, '.');
    var dbCupom = require('../../model/ultra-pos/cupom')(h);
    let cupom = req.body;

    dbCupom.findOneAndUpdate({ _id: cupom._id }, cupom, { new: true, upsert: true, runValidators: false },
        function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
});


router.delete("/:banco/delete/:id", function(req, res) {
    var h = req.params.banco.replace(/db[_]pos[_]/gmi, '').replace(/[_]/gmi, '.');
    var id = req.params.id;
    var dbCupom = require('../../model/ultra-pos/cupom')(h);
    let cupom = req.body;

    dbCupom.findOneAndRemove({ _id: id },
        function(err, data) {
            if (err) {
                res.send({ deleted: false, err });
            } else {
                res.send({ deleted: true, err: null });
            }
        });
})


router.get("/find/:codigoCupom", function(req, res) {
    var dbCupom = require('../../model/ultra-pos/cupom')(req.hostname);
    dbCupom.find({ codigoCupom: req.params.codigoCupom }, {}, //, 'categories.name.pt': true
        function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data[0]);
            }
        });
})


router.post("/calcula/:codigoCupom/:valor/:valorMatricula", function(req, res) {
    var dbCupom = require('../../model/ultra-pos/cupom')(req.hostname);
    dbCupom.find({ codigoCupom: req.params.codigoCupom }, //, 'categories.name.pt': true
        function(err, cupoms) {
            if (err) {
                res.send(err);
            } else {
                if (cupoms.length > 0) {
                    var cupom = cupoms[0];

                    cupom.quantidadeUsos = (cupom.quantidadeUsos === 0 || cupom.quantidadeUsos === null ? 0 : (cupom.quantidadeUsos || -1));

                    if (cupom.quantidadeUsos > 0 || cupom.quantidadeUsos === -1) {
                        if (cupom.tipoDesconto === 'valor') {

                            cupom.set('valorCalculado', Math.round(((Number(req.params.valor) - Number(cupom.valorDesconto))) * 100) / 100, { strict: false });
                            cupom.set('valorMatriculaCalculado', Math.round(((Number(req.params.valorMatricula) - Number(cupom.valorDescontoMatricula))) * 100) / 100, { strict: false });

                        } else if (cupom.tipoDesconto === 'percentual') {

                            cupom.set('valorCalculado', Math.round(((Number(req.params.valor) - Number(req.params.valor) * Number(cupom.percentualDesconto))) * 100) / 100, { strict: false });
                            cupom.set('valorMatriculaCalculado', Math.round(((Number(req.params.valorMatricula) - Number(req.params.valorMatricula) * Number(cupom.percentualDescontoMatricula))) * 100) / 100, { strict: false });

                        } else {

                            cupom.set('valorCalculado', Math.round(((Number(req.params.valor) - Number(cupom.valorDesconto))) * 100) / 100, { strict: false });
                            cupom.set('valorMatriculaCalculado', Math.round(((Number(req.params.valorMatricula) - Number(cupom.valorDescontoMatricula))) * 100) / 100, { strict: false });

                        }

                        if (cupom.quantidadeUsos === -1) {
                            res.send({ Ok: true, cupom });
                        } else {
                            cupom.quantidadeUsos--;
                            console.log('cupom.quantidadeUsos : ', cupom.quantidadeUsos);

                            dbCupom.findOneAndUpdate({ _id: cupom._id }, cupom, { new: true }, function(err, cupom2) {
                                if (err) {
                                    res.status(500);
                                    res.send({ Ok: false, err, cupom })
                                } else {
                                    res.send({ Ok: true, cupom });
                                }
                            })
                        }


                    } else {
                        res.status(403);
                        res.send({ Ok: false, msg: 'Cupom já expirado ou utilizado', cupom })
                    }

                } else {
                    res.status(403);
                    res.send({ Ok: false, msg: 'Cupom ' + req.params.codigoCupom + ' não encontrado na base de cupons, verifique a digitação ' })
                }


            }
        });
})




module.exports = router;