var fs = require('fs');

var WooCommerceAPI = require('woocommerce-api');

var WooCommerce = new WooCommerceAPI({
    url: 'https://ultraposgraduacao.com.br',
    consumerKey: 'ck_3ee8797c7d408b82cc22aff931b887b0f1d995fe',
    consumerSecret: 'cs_18b708e8cfc45ed6f0390697c4d4220f4bea0169',
    wpAPI: true,
    version: 'wc/v2',
    queryStringAuth: true, // Force Basic Authentication as query string true and using under HTTPS
});


//criarCliente()
// mostraClientes()
// mostraCupons();
// carregarCategoria();
// carregarCursos();

mostraProdutos();

function mostraProdutos() {
    WooCommerce.get('products?per_page=1000', function(err, data, res) {
        console.log(JSON.stringify(JSON.parse(res), null, 2));
        console.log('>> ' + JSON.parse(res).length)
    });
}

function criarCliente() {
    var data = exChico();
    WooCommerce.post('customers', data, function(err, data, res) {
        console.log(JSON.stringify(JSON.parse(res), null, 2));
    });
}

function mostraClientes() {
    WooCommerce.get('customers?search=039.100.557-02', function(err, data, res) {
        console.log(JSON.stringify(JSON.parse(res), null, 2));
    });
}


function mostraCupons() {
    WooCommerce.get('coupons', function(err, data, res) {
        console.log(JSON.stringify(JSON.parse(res), null, 2));
    });
}


function carregarCategoria(f) {
    var categorias = [];
    var strJson = fs.readFileSync('./json/categorias.json');
    var categorias = require("./json/categorias.json");

    categorias.forEach(cat => {

        console.log('')
        console.log('*************************************************************')
        console.log('Categoria: ' + cat.name.pt)
        let novaCategoria = {
            "name": cat.name.pt,
            "slug": cat.handle.pt,
        }
        WooCommerce.post('products/categories', novaCategoria, function(err, data, res) {
            console.log(JSON.stringify(JSON.parse(res), null, 2));
        });
    });
}


function carregarCursos(f) {
    var categorias = [];
    var categorias = require("./json/categorias.json");
    var cursos = require("./json/cursos-nuvem.json");


    WooCommerce.get('products/categories?per_page=100&page=1', function(err, data, categoriasNovas) {
        categoriasNovas = JSON.parse(categoriasNovas);
        // console.log(JSON.stringify(cursos[0].categories, null, 3))
        // console.log(JSON.stringify(categoriasNovas, null, 3))
        console.log(JSON.stringify(idCategoria(cursos[0].categories), null, 3));

        cursos.forEach(c => {
            var data = {
                name: c.name.pt,
                type: 'simple',
                regular_price: c.variants[0].price,
                description: c.description.pt,
                short_description: '',
                categories: idCategoria(c.categories),
                images: getImagens(c.images)
            };
            console.log("Criando: " + c.name.pt);
            WooCommerce.post('products', data, function(err, data, res) {
                console.log(res);
            });
        });


        function nvCategoria(arrayCategorias) {
            return categoriasNovas.filter(function(e) {
                if (arrayCategorias.length) {
                    return arrayCategorias.filter(function(f) {
                        //console.log((f.name.pt == e.name ? '** ' : '') + f.name.pt + '==' + e.name)
                        return f.name.pt == e.name;
                    }).length > 0;
                } else return false;
            })
        }

        function idCategoria(arrayCategorias) {
            var cn = nvCategoria(arrayCategorias);
            var ar = [];
            cn.forEach(e => {
                ar.push({ id: e.id });
            });
            return ar;
        }

        function getImagens(arrayImagens) {
            var ar = [];
            arrayImagens.forEach(e => {
                ar.push({ src: e.src, position: e.position });
            });
            return ar;
        }

    });

}


function exChico() {
    return {
        "username": "039.100.557-02",
        "email": "fran.fig+wp@gmail.com",
        "first_name": "Francisco Lima Figueiredo",
        "last_name": "",
        "role": "customer",
        "billing": {
            "first_name": "Francisco Lima Figueiredo",
            "last_name": "",
            "company": "",
            "address_1": "Quadra 210 lote 8 Bloco B Apt",
            "address_2": "Residencial Yes",
            "city": "Brasília",
            "state": "DF",
            "postcode": "71931-000",
            "country": "BR",
            "email": "fran.fig+wp@gmail.com",
            "phone": "(61) 99313-3560",
            "number": "708",
            "neighborhood": "Águas Claras",
            "persontype": "F",
            "cpf": "03910055702",
            "rg": "2763789 SSP DF",
            "cnpj": "",
            "ie": "",
            "birthdate": "",
            "sex": "",
            "cellphone": "(61) 99313-3560"
        },
        "shipping": {
            "first_name": "Francisco Lima Figueiredo",
            "last_name": "",
            "company": "CAIXA",
            "address_1": "Quadra 210 lote 8 Bloco B Apt",
            "address_2": "Residencial Yes",
            "city": "Brasília",
            "state": "",
            "postcode": "71931-000",
            "country": "BR",
            "number": "708",
            "neighborhood": "Águas Claras"
        },
        "meta_data": [{
                "id": 514,
                "key": "shipping_method",
                "value": ""
            },
            {
                "id": 515,
                "key": "billing_cpf",
                "value": "03910055702"
            },
            {
                "id": 516,
                "key": "billing_rg",
                "value": "2763789 SSP DF"
            },
            {
                "id": 517,
                "key": "billing_number",
                "value": "708"
            },
            {
                "id": 518,
                "key": "billing_neighborhood",
                "value": "Águas Claras"
            },
            {
                "id": 519,
                "key": "billing_cellphone",
                "value": "(61) 99313-3560"
            },
            {
                "id": 520,
                "key": "billing_email-2",
                "value": "fran.fig+wp@gmail.com"
            },
            {
                "id": 528,
                "key": "shipping_number",
                "value": "708"
            },
            {
                "id": 530,
                "key": "shipping_neighborhood",
                "value": "Águas Claras"
            }
        ]
    }

}