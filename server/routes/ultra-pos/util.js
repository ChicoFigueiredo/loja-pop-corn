var db;
var categorias;
var cursos;
var WooCommerce = {};

var express = require('express');
var router = express.Router();

router.get("/initialize", function(req, res) {
    var dbAlunos = require('../../model/ultra-pos/alunos')(req.hostname, true);
    var dbCategorias = require('../../model/ultra-pos/categorias')(req.hostname, true);
    var dbCupom = require('../../model/ultra-pos/cupom')(req.hostname, true);
    var dbCursos = require('../../model/ultra-pos/cursos')(req.hostname, true);
    res.send({ foi: true });
})

router.post("/update/categorie", function(req, res) {
    categorias = categorias || require('../../model/ultra-pos/categorias')(req.hostname);
    cu = req.body;
    var nc = {
        "id": ct.id,
        "name": {
            "pt": ct.name
        },
        "description": {
            "pt": ct.description
        },
        "handle": {
            "pt": ct.slug
        },
        "parent": ct.parent,
        "subcategories": [],
        "seo_title": {
            "pt": null
        },
        "seo_description": {
            "pt": null
        },
        published: true
    }
    categorias.findOneAndUpdate({ id: nc.id }, nc, { upsert: true, new: true, runValidators: true }, function(err, curso) {
        if (err) {
            console.log('fudeu ' + JSON.stringify(err));
            res.send({ Ok: false, err });
        } else {
            res.send({ Ok: true, curso })
        }
    })
});

router.post("/delete/categoria", function(req, res) {
    cursos = cursos || require('../../model/ultra-pos/cursos')(req.hostname);
    cu = req.body;
    var nc = {
        "id": cu.id,
    }
    cursos.remove({ id: nc.id }, function(err, curso) {
        if (err) {
            console.log('fudeu ' + JSON.stringify(err));
            res.send({ Ok: false, err });
        } else {
            res.send({ Ok: true, curso })
        }
    })
});


router.post("/update/product", function(req, res) {
    cursos = cursos || require('../../model/ultra-pos/cursos')(req.hostname);
    cu = req.body;
    var nc = {
        "id": cu.id,
        "name": {
            "pt": cu.name
        },
        "description": {
            "pt": cu.description
        },
        "handle": {
            "pt": cu.slug
        },
        "attributes": [],
        "published": (cu.status == 'publish'),
        "free_shipping": false,
        "brand": null,
        "tags": "",
        "categories": getCategoriasCursos(cu.categories),
        "variants": [{
            "id": cu.id * 10000 + 1,
            "image_id": null,
            "product_id": cu.id,
            "position": 1,
            "price": cu.price,
            "promotional_price": null,
            "stock_management": false,
            "stock": null,
            "weight": "0.000",
            "width": "0.00",
            "height": "0.00",
            "depth": "0.00",
            "sku": null,
            "values": [],
            "barcode": null,
            "down_payment": cu.dimensions.length === null || cu.dimensions.length === 0 ? 0 : cu.dimensions.length, // matricula
            "max_payments": cu.dimensions.width == null || cu.dimensions.width === 0 ? 24 : cu.dimensions.width
        }],
        codigo_vindi: cu.weight
    }
    cursos.findOneAndUpdate({ id: nc.id }, nc, { upsert: true, new: true, runValidators: true }, function(err, curso) {
        if (err) {
            console.log('fudeu ' + JSON.stringify(err));
            res.send({ Ok: false, err });
        } else {
            res.send({ Ok: true, curso })
        }
    })
});

router.post("/delete/product", function(req, res) {
    cursos = cursos || require('../../model/ultra-pos/cursos')(req.hostname);
    cu = req.body;
    var nc = {
        "id": cu.id,
    }
    cursos.remove({ id: nc.id }, function(err, curso) {
        if (err) {
            console.log('fudeu ' + JSON.stringify(err));
            res.send({ Ok: false, err });
        } else {
            res.send({ Ok: true, curso })
        }
    })
});


var oRes = { Ok: false, count: 0, cat_count: 0, curso_count: 0, cat: [], cursos: [], steps: '\n' }
router.get("/sincronize", function(req, res) {
    categorias = categorias || require('../../model/ultra-pos/categorias')(req.hostname);
    cursos = cursos || require('../../model/ultra-pos/cursos')(req.hostname);

    categorias.remove({}, function(err) {
        if (err) {
            res.send(err)
            return;
        };
        oRes = { Ok: false, count: 0, cat: [], steps: '\n' };
        capturaCategorias(page = 1, req, res, function(categories_capture) {
            console.log('categorias: ', categories_capture);
            categorias.create(categories_capture, function(err, docs) { //, { ordered: false }
                console.log('docs categorias: ', docs);
                if (err) {
                    res.send(err);
                } else {
                    oRes.count = docs.length;
                    oRes.cat_count = docs.length;
                    //oRes.cat = docs;
                    cursos_capture = [];
                    cursos.remove({}, function(err) {
                        if (err) {
                            res.send(err)
                            return;
                        };
                        capturaProdutos(page = 1, req, res, function(cursos_capture) {
                            //console.log('cursos: ', cursos_capture);
                            cursos.create(cursos_capture, function(err2, docs2) {
                                console.log('foi')
                                if (err2) {
                                    res.send(err2);
                                } else {
                                    oRes.Ok = true;
                                    oRes.count += docs2.length;
                                    oRes.cursos_count = docs2.length;
                                    //oRes.cursos = docs2;
                                    res.send(oRes);
                                }
                            })
                        })
                    })
                }
            })
        })
    });
})


router.get("/db/list", function(req, res) {
    db = db || require('../../model/ultra-pos/_db')(req.hostname);
    var admin_mongo = db.connections[0].db.admin();
    admin_mongo.listDatabases(function(err, result) {
        var allDatabases = result.databases;
        if (allDatabases.length > 0) {
            allDatabases = allDatabases.filter((x) => {
                return !x.name.search(/db_pos/gmi)
            });
            allDatabases.forEach((x) => {
                x.value = x.name;
                x.name = toTitleCase(x.value.replace(/db_pos_/gmi, '').replace(/[_]/gmi, ' ')).replace(' Com Br', '');
            });
        }
        res.send(allDatabases);
    });
});

var fcListaSite = function(req, res) {
    db = db || require('../../model/ultra-pos/_db')(req.hostname);
    const sulfix = '_' + (req.params.sulfix || 'cupom');
    const rx = new RegExp(sulfix + '$')
    db.connections[0].db.listCollections().toArray((err, names) => {
        let sites = [];
        names.forEach(e => {
            if (e.name.match(rx)) {
                sites.push({ nome: e.name.replace(rx, '').replace(/[_]/gmi, '.'), valor: e.name.replace(rx, '') });
            }
        });
        res.send(sites);
        return;
    });
    // res.send({ Ok: false })
}

router.get("/sites/list", fcListaSite);

router.get("/sites/list/:sulfix", fcListaSite);

module.exports = router;

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}



/**
 * CAPTURANDO CATEGORIAS
 */

var categories_capture = [];

function capturaCategorias(page = 1, reqROOT, resROOT, cbFinish) {
    console.log('Cap Cat URL:', reqROOT.hostname)
    let WooCommerceLocal = require('../../model/ultra-pos/_woocomerce')(reqROOT.hostname);
    var msg = '*********** PAGINA ' + page;
    console.log(msg);
    oRes.steps += msg + '\n'
    if (page == 1) { categories_capture = [] };

    WooCommerceLocal.get('products/categories?per_page=10&page=' + page, function(err, data, res) {
        console.log('Erros WooCommerceLocal: ', err);
        console.log('data WooCommerceLocal: ', data);
        console.log('res WooCommerceLocal: ', res);
        res = JSON.parse(res)
        if (res.length > 0) {
            res.forEach(ct => {
                console.log(' do ct ' + ct.id)
                var nc = {
                    "id": ct.id,
                    "name": {
                        "pt": ct.name
                    },
                    "description": {
                        "pt": ct.description
                    },
                    "handle": {
                        "pt": ct.slug
                    },
                    "parent": ct.parent,
                    "subcategories": [],
                    "seo_title": {
                        "pt": null
                    },
                    "seo_description": {
                        "pt": null
                    },
                    published: true
                }

                categories_capture.push(nc);
            });
            capturaCategorias(page + 1, reqROOT, resROOT, cbFinish)
        } else {
            console.log('categorias concluida! ');
            cbFinish(categories_capture);
        }
    });
    console.log('*********** FIM ' + page);

}

/**
 * CAPTURANDO CURSOS
 */

function getCategoriasCursos(mt) {
    var mt2 = [];
    mt.forEach(c => {
        mt2.push({ "id": c.id })
    })
    return mt2;
}

var cursos_capture = [];

function capturaProdutos(page = 1, reqROOT, resROOT, cbFinish) {
    console.log('Cap Cat URL:', reqROOT.hostname)
    WooCommerce[reqROOT.hostname] = WooCommerce[reqROOT.hostname] || require('../../model/ultra-pos/_woocomerce')(reqROOT.hostname);
    console.log('*********** PAGINA ' + page);
    WooCommerce[reqROOT.hostname].get('products?per_page=10&page=' + page, function(err, data, res) {
        res = JSON.parse(res)
            //console.log(JSON.stringify(res, null, 2));
        if (res.length > 0) {
            res.forEach(cu => {
                console.log(' do cu ' + cu.id)
                var nc = {
                    "id": cu.id,
                    "name": {
                        "pt": cu.name
                    },
                    "description": {
                        "pt": cu.description
                    },
                    "handle": {
                        "pt": cu.slug
                    },
                    "attributes": [],
                    "published": (cu.status == 'publish'),
                    "free_shipping": false,
                    "brand": null,
                    "tags": "",
                    "categories": getCategoriasCursos(cu.categories),
                    "variants": [{
                        "id": cu.id * 10000 + 1,
                        "image_id": null,
                        "product_id": cu.id,
                        "position": 1,
                        "price": cu.price,
                        "promotional_price": null,
                        "stock_management": false,
                        "stock": null,
                        "weight": "0.000",
                        "width": "0.00",
                        "height": "0.00",
                        "depth": "0.00",
                        "sku": null,
                        "values": [],
                        "barcode": null,
                        "down_payment": cu.dimensions.length === null || cu.dimensions.length === 0 ? 0 : cu.dimensions.length, // matricula
                    }],
                    codigo_vindi: cu.weight
                }
                cursos_capture.push(nc);
                // cursos.findOneAndUpdate({ id: nc.id }, // find a document with that filter
                //     nc, // document to insert when nothing was found
                //     { upsert: true }, //, new: false, runValidators: true, strict: true }, // options
                //     function(err, alunos) { // callback
                //         if (err) {
                //             console.log('fudeu ' + JSON.stringify(err));
                //         }
                //         console.log('Foi cu ' + nc.id)
                //     });
            });
            capturaProdutos(page + 1, reqROOT, resROOT, cbFinish)
        } else {
            console.log('cursos completos');
            cbFinish(cursos_capture);
        }
    });
    console.log('*********** FIM ' + page);
}


// processaPaginaCategoria(1);

// processaPaginaProduto(1);

// setTimeout(() => {
//     console.log('Iniciando Matricula')
//     cursos.find({}, {},
//         function(err, acu) {
//             if (err) {
//                 res.send(err);
//             } else {
//                 acu.forEach(function(e) {
//                     var t = e.variants;
//                     t.forEach(function(e) {
//                         e.down_payment = 100
//                     });
//                     cursos.findOneAndUpdate({ _id: e._id }, { $set: { variants: t } });
//                     console.log('atualizando ' + e.id)
//                 });
//             }
//         }
//     )

//     setTimeout(() => {
//         process.exit(0);
//     }, 60000 * 1)

// }, 60000 * 1);