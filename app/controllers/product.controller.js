const Product = require("../models/product.model.js");
const fs = require("fs");

exports.create = async (req, res, next) => {
  console.log(req.file);
  try {
    const { name, description, size, color, price, quantity } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;

    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      size,
      color,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      image_path: image_path,
    });

    // Save the new product to the database
    Product.create(newProduct, image_path, (err, createdProduct) => {
      if (err) {
        console.error("Error creating product:", err);
        return res.status(500).json({
          status: false,
          data: [],
          message: "Sản phẩm này đã tồn tại. Vui lòng tạo mới!",
        });
      }

      // Attach the product instance to the request object
      req.product = createdProduct;

      // Send a response with the created product details
      res.status(200).json({
        status: true,
        data: [newProduct],
        message: "Create success!!!",
      });
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({
      status: false,
      data: [],
      message: "Create fail!!!",
    });
  }
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
    console.error("Error retrieving products:", error);
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
