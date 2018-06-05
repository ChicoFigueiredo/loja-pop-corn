a = lista_produtos = require('./json/lojapopcorn-produtos.json');
console.log(a.length);

const sl = 'pomada-desitin-roxa-136g1';


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


lista_produtos = require('./json/lojapopcorn-produtos.json');

captureProdutos(1);

let arrP = [];

function captureProdutos(page = 1) {
    console.log("================= page ", page)
    WooCommerce.get('products?page=' + page, function(err, data, res) {
        if (err) {
            console.log("Err =>", err);
            return
        }
        const prod = JSON.parse(res);
        if (prod) {
            if (prod.length > 0) {
                prod.forEach(e => {
                    prd = lista_produtos.filter(t => t.handle.pt.replace(/^\s+|\s+$/gmi, '') === e.slug)[0];
                    if (prd) {
                        q = 0
                        prd.variants.forEach(v => {
                            q += Number(v.stock);
                        });
                        up = {
                            id: e.id,
                            dimensions: {
                                width: prd.variants[0].width,
                                height: prd.variants[0].height,
                                length: prd.variants[0].depth
                            },
                            manage_stock: true,
                            stock_quantity: q,
                            in_stock: q > 0,
                        }
                        console.log('up = ', up);
                        arrP.push(up);
                    }
                });
                captureProdutos(page + 1)
            } else {
                console.log('tam = ', arrP.length);
                putimage(arrP, 0)
            }
        } else {
            console.log('tam = ', arrP.length);
            putimage(arrP, 0)
        }
    });
}


function putimage(arr, i) {
    if (arr[i]) {
        n = arr[i];
        WooCommerce.put('products/' + n.id, n, function(err, data, res) {
            if (err) {
                console.log("Err =>", err);
            }
            console.log(res);
            putimage(arr, i + 1)
        });
    } else {
        return
    }
};