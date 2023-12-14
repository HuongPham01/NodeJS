const express = require("express");
const products = require("../controllers/product.controller");
const router = require("express").Router();
const uploadImageMiddleware = require("../middlewares/uploadMiddleware");
const sortMiddleware = require("../middlewares/sort.middleware");
const filterMiddleware = require("../middlewares/filter.middleware");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new product/signup product
  router.post("/create", uploadImageMiddleware, products.create);

  // Retrieve all products
  router.get("/filter", filterMiddleware, products.getAllProducts);
  router.get("/sort", sortMiddleware, products.getAllProducts);

  // Retrieve a single product with id
  router.get("/:id", products.findOne);

  // Update a product with id
  router.put("/update/:id", products.update);

  // Delete a product with id
  router.delete("/delete/:id", products.delete);

  // Delete all products
  // router.delete("/", products.deleteAll);

  app.use("/api/products", router);
};
