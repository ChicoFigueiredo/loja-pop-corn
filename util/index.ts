const world = '🗺️';

export function hello(word: string = world): string {
  return `Hello ${world}! `;
}

console.log(hello());

import * as WooCommerceAPI from 'woocommerce-api';
// var WooCommerceAPI = require('woocommerce-api');
 
var WooCommerce = new WooCommerceAPI({
  url: 'https://ultraposgraduacao.com.br',
  consumerKey: 'ck_39a9bee2ef91d168aab193a974747b4ae4e3c53b',
  consumerSecret: 'cs_161c1616284321bfceecfd4aabc96eea7951590c',
  version: 'v3'
});

WooCommerce.get('', function(err, data, res) {
  console.log(res);
});

// var querystring = require('querystring');

// var store_url = 'http://example.com';
// var endpoint = '/wc-auth/v1/authorize';
// var params = {
//   app_name: 'Chico',
//   scope: 'read_write',
//   user_id: 123,
//   return_url: 'http://app.com/return-page',
//   callback_url: 'https://app.com/callback-endpoint'
// };
// var query_string = querystring.stringify(params).replace(/%20/g, '+');

// console.log(store_url + endpoint + '?' + query_string);