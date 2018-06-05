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

WooCommerce.get('products/409', function(err, data, res) {
    const prod = JSON.parse(res);
    console.log(JSON.stringify(prod, null, 3));
});

return 0;

p = '409'

// WooCommerce.get('products/' + p, function(err, data, res) {
//     const prod = JSON.parse(res);
//     //console.log(JSON.stringify(prod, null, 3));
//     if (prod.images[0].position == 0) {
//         prod.images[0].position = 1;
//         let p2 = JSON.parse(JSON.stringify(prod.images[0]));
//         // let p3 = JSON.parse(JSON.stringify(prod.images[0]));

//         let n = {
//             images: [{
//                     id: p2.id,
//                     position: 0
//                 },
//                 {
//                     id: p2.id,
//                     position: 1
//                 }
//             ]
//         }
//         console.log('================================================================')
//         WooCommerce.put('products/' + p, n, function(err, data, res) {
//             if (err) {
//                 console.log("Err =>", err);
//             }
//             const prod2 = JSON.parse(res);
//             console.log(JSON.stringify(prod2, null, 3));
//         });
//     }
// });

arrP = [];
// WooCommerce.get('products?per_page=10', function(err, data, res) {
//     if (err) {
//         console.log("Err =>", err);
//         return
//     }
//     const prod = JSON.parse(res);
//     prod.forEach(e => {
//         if (e.images.length > 0) {
//             np = 0;
//             n = {
//                 id: e.id,
//                 images: [{
//                     id: e.images[0].id,
//                     position: np
//                 }]
//             }
//             e.images.forEach(f => {
//                 np++;
//                 n.images.push({
//                     id: f.id,
//                     position: np
//                 });
//             });
//             arrP.push(n);
//         }
//     });
//     console.log('tam = ', arrP.length);
//     putimage(arrP, 0)
// });

captureProdutos(1);

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
                    if (e.images.length > 0) {
                        np = 0;
                        n = {
                            id: e.id,
                            images: [{
                                id: e.images[0].id,
                                position: np
                            }]
                        }
                        e.images.forEach(f => {
                            np++;
                            n.images.push({
                                id: f.id,
                                position: np
                            });
                        });
                        arrP.push(n);
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