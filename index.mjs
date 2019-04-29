import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

import Client from 'shopify-buy';
import client from './src/js-buy-sdk.mjs';

// Storefront API
const port = 3000;
const __dirname = path.resolve(path.dirname(''));

// CollectionIDs.
const shirtCollectionID = "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzY5Mzk2NzkxMzE4";
const pantsCollectionID = "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzY5Mzk2ODI0MDg2";
const shoesCOllectionID = "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzY5Mzk2ODU2ODU0";



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  // I really dislike storing checkout ID in querystring, but its the approach given in example application.
  const checkoutId = req.query.checkoutId;
  if (!checkoutId) {
    return client.checkout.create().then((checkout) => {
      res.redirect(`/?checkoutId=${checkout.id}`);
    });
  };
  res.render("home.ejs")
});

app.get('/shirts', (req, res) => {
  const checkoutId = req.query.checkoutId;
  let shirts = {};
  // Below should be turned into a module since its repeated.
  if (!checkoutId) {
    return client.checkout.create().then((checkout) => {
      res.redirect(`/?checkoutId=${checkout.id}`);
    });
  };

  client.collection.fetchWithProducts(shirtCollectionID).then((collection) => {
    var products = collection.products;
    products.forEach(function(p) {
      shirts[p["id"]] = p;
      // Not efficient for large collections. But these are only 3 products

      // client.product.fetch(p["id"]).then((product) => {
      //   console.log(product["GraphModel"])
      // });
    });
    res.render("collection.ejs", {step: "Shirts", products : shirts});
  });
});


// CART MANIPULATION.
// Almost entirely ripped from node-js-buy example.
app.post('/add_line_item/:id/:qty/:checkoutId', (req, res) => {
  const options = req.body;
  const productId = req.params.id;
  const checkoutId = req.params.checkoutId;
  const quantity = parseInt(req.params.qty, 10);
  // const productsPromise = Client.fetchAllProducts();

    // Find the product that is selected
    // const targetProduct = products.find((product) => {
    //   return product.id === productId;
    // });

    // Find the corresponding variant
    // const selectedVariant = Client.Product.Helpers.variantForOptions(productId, options);

    // Add the variant to our cart
    // console.log(client);
    console.log(Client);
    return client.checkout.addLineItems(checkoutId, [{variantId: productId, quantity}]).then((checkout) => {
      res.redirect(`/?cart=true&checkoutId=${checkoutId}`);
    });
});

app.post('/remove_line_item/:id', (req, res) => {
  const checkoutId = req.body.checkoutId;

  return client.removeLineItems(checkoutId, [req.params.id]).then((checkout) => {
    res.redirect(`/?cart=true&checkoutId=${checkout.id}`);
  });
});

app.post('/decrement_line_item/:id', (req, res) => {
  const checkoutId = req.body.checkoutId;
  const quantity = parseInt(req.body.currentQuantity, 10) - 1;

  return client.updateLineItems(checkoutId, [{id: req.params.id, quantity}]).then((checkout) => {
    res.redirect(`/?cart=true&checkoutId=${checkout.id}`);
  });
});

app.post('/increment_line_item/:id', (req, res) => {
  const checkoutId = req.body.checkoutId;
  const quantity = parseInt(req.body.currentQuantity, 10) + 1;

  return client.updateLineItems(checkoutId, [{id: req.params.id, quantity}]).then((checkout) => {
    res.redirect(`/?cart=true&checkoutId=${checkout.id}`);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
