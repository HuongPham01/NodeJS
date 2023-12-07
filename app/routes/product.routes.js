const products = require("../controllers/product.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  var router = require("express").Router();

  // Create a new product/signup product
  router.post("/", products.create);

  // Retrieve all products
  router.get("/", products.findAll);

  // Retrieve a single product with id
  router.get("/:id", products.findOne);

  // Update a product with id
  router.put("/:id", products.update);

  // Delete a product with id
  router.delete("/:id", products.delete);

  // Delete all products
  // router.delete("/", products.deleteAll);

  app.use("/api/products", router);
};
