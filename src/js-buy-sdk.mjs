import fetch from 'node-fetch'
import Client from '../node_modules/shopify-buy';

global.fetch = fetch;

const config = {
  domain: 'bitossi-wholesale-test-store.myshopify.com',
  storefrontAccessToken: 'd63bc210bd3660547df82c70799c1605'
};

export default new Client(config);
