var WooCommerce = {};
var WooCommerceAPI = {};

module.exports = function(url = '') {
    console.log('woocomerce url:', url)
    let urlLoja = getWooCommerceURL(url);
    WooCommerceAPI[url] = WooCommerceAPI[url] || require('woocommerce-api');

    WooCommerce[url] = WooCommerce[url] || new WooCommerceAPI[url]({
        url: 'https://' + urlLoja,
        consumerKey: 'ck_3ee8797c7d408b82cc22aff931b887b0f1d995fe',
        consumerSecret: 'cs_18b708e8cfc45ed6f0390697c4d4220f4bea0169',
        wpAPI: true,
        version: 'wc/v2',
        queryStringAuth: true, // Force Basic Authentication as query string true and using under HTTPS
    });

    console.log("obj WooCommerce[url]", WooCommerce[url])

    return WooCommerce[url];

};


function getWooCommerceURL(url = '') {
    return (url === '' || url === 'localhost') ? 'ultraposgraduacao.com.br' : url.replace(/^inscricao[.]/gmi, '').replace(/^api[.]/gmi, '');
}