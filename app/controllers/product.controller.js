const Product = require("../models/product.model.js");

//Create Product
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
      image_path,
    });

    const createdProduct = await Product.createProduct(newProduct, image_path);

    res.status(201).json({
      status: true,
      data: [createdProduct],
      message: "Create success!!!",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      status: false,
      data: [],
      message: "Create fail!!!",
    });
  }
};

//GetAll
exports.getAllProducts = async (req, res) => {
  try {
    // Check if sorting or filtering parameters are present
    const hasSortOrFilterParams =
      req.query.sortBy ||
      req.query.sortDirection ||
      req.query.name ||
      req.query.size ||
      req.query.color;
    // req.query.brand;

    if (hasSortOrFilterParams) {
      // Sorting and/or filtering requested
      const sortOptions = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
      };

      const filterOptions = {
        name: req.query.name,
        size: req.query.size,
        color: req.query.color,
        // brand: req.query.brand,
      };

      // Call the sortAndFilterProducts method from the Product model
      const result = await Product.sortAndFilterProducts(
        sortOptions,
        filterOptions
      );

      // Send the result as JSON response
      res.status(200).json(result);
    } else {
      // No sorting or filtering parameters, retrieve all products

      if (req.query.page || req.query.limit) {
        // If pagination parameters are present
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const products = await Product.getAllAndPaginate({ limit, offset });

        res.json({ products, page, limit });
      } else {
        const products = await Product.getAll();
        res.json(products);
      }
    }
  } catch (error) {
    console.error("Error retrieving or sorting/filtering products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// SEARCH BY NAME
exports.searchByName = async (req, res) => {
  try {
    const searchTerm = req.query.name;

    if (!searchTerm) {
      return res.status(400).json({
        status: false,
        data: [],
        message: "Search term (name) is required.",
      });
    }

    const result = await Product.searchByName(searchTerm);

    res.status(200).json({
      status: true,
      data: result,
      message: "Search results for product names matching the provided term.",
    });
  } catch (error) {
    console.error("Error in product name search:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Find a Product by Id
exports.findOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    if (error.kind === "not_found") {
      res.status(404).json({
        message: `Not found Product with id ${req.params.id}.`,
      });
    } else {
      res.status(500).json({
        message: `Error retrieving Product with id ${req.params.id}.`,
        error: error.message,
      });
    }
  }
};

// Delete by Id
exports.delete = async (req, res) => {
  try {
    await Product.remove(req.params.id);
    res.json({ message: `Product was deleted successfully!` });
  } catch (error) {
    if (error.kind === "not_found") {
      res.status(404).json({
        message: `Not found Product with id ${req.params.id}.`,
      });
    } else {
      res.status(500).json({
        message: `Could not delete Product with id ${req.params.id}`,
      });
    }
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const updatedProduct = new Product(req.body);
    const result = await Product.updateById(req.params.id, updatedProduct);
    res.json(result);
  } catch (error) {
    if (error.kind === "not_found") {
      res.status(404).json({
        message: `Not found Product with id ${req.params.id}.`,
      });
    } else {
      console.error("Error updating product:", error);
      res.status(500).json({
        message: `Error updating Product with id ${req.params.id}.`,
        error: error.message,
      });
    }
  }
};
