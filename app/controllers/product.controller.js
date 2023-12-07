const Product = require("../models/product.model.js");

// Create a new product
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  // Save Product in the database
  Product.create(product, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product.",
      });
    else res.send(data);
  });
};

// Retrieve all Products
exports.findAll = (req, res) => {
  const email = req.query.email;

  Product.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Products.",
      });
    else res.send(data);
  });
};

// Find a Product by Id
exports.findOne = (req, res) => {
  Product.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Productwith id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
  Product.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Product with id " + req.params.id,
        });
      }
    } else res.send({ message: `Product was deleted successfully!` });
  });
};

// Update a Product
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  Product.updateById(req.params.id, new Product(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Product with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};
