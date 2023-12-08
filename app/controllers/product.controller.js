const Product = require("../models/product.model.js");

// Create a new product
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Product object using the data from the request
  const newProduct = new Product(req.body);

  // Save Product in the database
  Product.create(newProduct, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product.",
      });
    else res.send(data);
  });
};

exports.getAllProducts = async (req, res) => {
  try {
    if (req.query.page || req.query.limit) {
      // If pagination parameters are present
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit; // vị trí lấy phần tử của trang thứ page và giới hạn là limit

      Product.getAllAndPaginate({ limit, offset }, (err, products) => {
        if (err) {
          res.status(500).json({
            message: err.message || "Internal Server Error",
          });
        } else {
          console.log(`Page: ${page}, Limit: ${limit}, Offset: ${offset}`);
          res.json({ products, page, limit });
        }
      });
    } else {
      // If no pagination parameters, retrieve all products
      Product.getAll((err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Products.",
          });
        } else {
          res.send(data);
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Find a Product by Id
exports.findOne = (req, res) => {
  Product.findById(req.params.id, (err, data) => {
    if (err) {
      console.error("Error retrieving product:", err);
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Product with id ${req.params.id}.`,
          error: err.message,
        });
      }
    }
    if (!data) {
      return res.status(404).send({
        message: `Not found Product with id ${req.params.id}.`,
      });
    }
    console.log(req.params.id);
    res.send(data);
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
  // if (!req.body) {
  //   res.status(400).send({
  //     message: "Content can not be empty!",
  //   });
  // }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
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
        console.error("Error updating product:", err);
        res.status(500).send({
          message: `Error updating Product with id ${req.params.id}.`,
          error: err.message,
        });
      }
    } else res.send(data);
  });
};
