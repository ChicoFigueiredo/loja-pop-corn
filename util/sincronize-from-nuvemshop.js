let WooCommerceAPI = require('woocommerce-api');

const urlLoja = "nova.lojapopcorn.com.br";

WooCommerce = new WooCommerceAPI({
    url: 'https://' + urlLoja,
    consumerKey: 'ck_566915ddb4408f9f9b7a84643186ea1541e8afbc',
    consumerSecret: 'cs_fb485f98c117d2e4e145b31a8370ae9613ecbc9f',
    wpAPI: true,
    version: 'wc/v2',
    queryStringAuth: true, // Force Basic Authentication as query string true and using under HTTPS
});



// sincronize_categorias();
// sincronize_produtos();

function sincronize_produtos() {
    lista_categorias = require('./json/lojapopcorn-categorias.json');
    lista_produtos = require('./json/lojapopcorn-produtos2.json');

    WooCommerce.get('products/categories', function(err, data, res) {
        const categorias = JSON.parse(res);
        // console.log(JSON.stringify(categorias, null, 3));

        function categoria_por_id(id) {
            let slug_categoria = "";
            lista_categorias.forEach(c => {
                if (c.id === id) {
                    slug_categoria = c.handle.pt.replace(/^\s+|\s+$/gmi, '');
                }
            });
            let id_categoria_retorno = 0;
            categorias.forEach(c => {
                if (c.slug === slug_categoria) {
                    id_categoria_retorno = c.id;
                }
            });
            return id_categoria_retorno;
        };

        function arrayCategorias(arr) {
            let arrReturn = [];
            arr.forEach(e => {
                arrReturn.push({
                    id: categoria_por_id(e.id)
                })
            });
            return arrReturn;
        }

        function arrayImages(arr) {
            let arrReturn = [];
            arr.forEach(e => {
                arrReturn.push({
                    src: e.src,
                    position: e.position
                })
            });
            if (arrReturn.length == 1) {
                arrReturn.push({
                    src: arrReturn[0].src,
                    position: 1
                })
            }
            return arrReturn;
        }

        novos_produtos = [];
        lista_produtos.forEach(e => {
            let np = {
                name: e.name.pt.replace(/^\s+|\s+$/gmi, ''),
                slug: e.handle.pt.replace(/^\s+|\s+$/gmi, ''),
                price: e.variants[0].promotional_price || e.variants[0].price,
                regular_price: e.variants[0].price,
                description: e.description.pt.replace(/^\s+|\s+$/gmi, ''),
                categories: arrayCategorias(e.categories),
                images: arrayImages(e.images)
            }

            console.log(e.name.pt, ' -> ');
            novos_produtos.push(np);
            // sleep(3);
        });

        putProduct(novos_produtos, 0);
    });
}

function putProduct(arr, i) {
    if (arr[i]) {
        let np = arr[i];
        WooCommerce.post('products', np, function(err, data, res) {
            console.log(res);
            putProduct(arr, i + 1)
        });
    } else {
        return true;
    }
}

function sincronize_categorias() {
    lista_categorias = require('./json/lojapopcorn-categorias.json');
    lista_categorias.forEach(e => {
        console.log(e.name.pt);
        const nc = {
            name: e.name.pt.replace(/^\s+|\s+$/gmi, ''),
            slug: e.handle.pt.replace(/^\s+|\s+$/gmi, '')
        };
        WooCommerce.post('products/categories', nc, function(err, data, res) {
            console.log(res);
        });
    });
}

function sleep(seconds) {
    var currentTime = new Date().getTime();

    while (currentTime + seconds * 1000 >= new Date().getTime()) {}
}