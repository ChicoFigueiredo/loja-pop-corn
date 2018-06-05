var express = require('express');
var router = express.Router();
var WooCommerceAPI = require('woocommerce-api');

var WooCommerce = require('../../model/ultra-pos/_woocomerce');

router
    .get("/summary", function(req, res) {
        var alunos = require('../../model/ultra-pos/alunos')(req.hostname);
        alunos.aggregate([
                { $match: { eAtivo: true } },
                { $unwind: "$cursos" }, // unwind before match
                {
                    $group: {
                        _id: "$cpf",
                        ParcelasMensais: { $sum: '$cursos.pagamento.parcela' },
                        count: { $sum: 1 },
                    }
                },
                {
                    $group: {
                        _id: null,
                        alunos: { $sum: 1 },
                        estimativaParcelasMensais: { $sum: '$ParcelasMensais' },
                        parcelasTotais: { $sum: "$count" },
                    }
                }

            ],
            function(err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(data);
                }
            });
    });

router.get("/list", function(req, res) {
    var alunos = require('../../model/ultra-pos/alunos')(req.hostname);
    alunos.find({}, "cpf nome",
        function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
})


router.get("/find/:cpf", function(req, response) {
    var alunos = require('../../model/ultra-pos/alunos')(req.hostname);
    alunos.find({ cpf: req.params.cpf }, { cursos: 0 }, function(err, data) {
        if (err) {
            response.send(err);
        } else {
            if (data.length > 0) {
                response.send(data);
            } else {
                WooCommerce.get('customers?search=' + req.params.cpf, function(err, data, res) {
                    if (err) {
                        response.send(err);
                    } else {
                        var cli = transform(data.body);
                        response.send(cli);
                    }
                });
            }
        }
    });
})


router.get("/get/:cpf", function(req, response) {
    var alunos = require('../../model/ultra-pos/alunos')(req.hostname);
    WooCommerce.get('customers?search=' + req.params.cpf, function(err, data, res) {
        if (err) {
            response.send(err);
        } else {
            var cli = transform(data.body);
            response.send(cli);
        }
    });
})

router.post("/save", function(req, res) {
    var alunos = require('../../model/ultra-pos/alunos')(req.hostname);
    console.log("Salvar : " + req.body.cpf);
    alunos.find({ cpf: req.body.cpf }, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
})


function transform(bo) {
    var c = JSON.parse(bo);
    if (c) {
        if (c.length > 0) {
            c = c[0];
            var res = [{
                "cpf": c.username,
                "bairro": c.billing.neighborhood,
                "celular": c.billing.cellphone,
                "cep": c.billing.postcode,
                "cidade": c.billing.city,
                "cidadeNaturalidade": '',
                "complemento": c.billing.address_2,
                "dataNascimento": c.billing.birthdate,
                "eAtivo": true,
                "email": c.email,
                "endereco": c.billing.address_1,
                "estadoCivil": c.billing.ie,
                "nome": c.first_name,
                "nomeMae": "",
                "nomePai": "",
                "numero": c.billing.number,
                "numeroIdentidade": c.billing.rg.replace(/\D/gi, ''),
                "opcaoSMS": true,
                "orgaoExpedidor": c.billing.rg.replace(/\d/gi, ''),
                "sexo": c.billing.sex,
                "uf": c.billing.state,
                "ufNaturalidade": "",
                "whatsapp": c.billing.phone
            }];
            return res;
        } else {
            var res = [];
            return res;
        }
    }
}



module.exports = router;