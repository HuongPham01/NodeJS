const Product = require("../models/product.model");
// const { Op } = require("sequelize");

const filterMiddleware = (req, res) => {
  const nameFilter = req.query.name;
  const sizeFilter = req.query.size;
  const colorFilter = req.query.color;
  const brandFilter = req.query.brand;

  // Create an object to hold the filtering criteria
  const filterCriteria = {};

  // Build the filter criteria based on the presence of each parameter
  if (nameFilter) {
    filterCriteria.name = nameFilter;
  }
  if (sizeFilter) {
    filterCriteria.size = sizeFilter;
  }

  if (colorFilter) {
    filterCriteria.color = colorFilter;
  }

  if (brandFilter) {
    filterCriteria.brand = brandFilter;
  }

  // Use the Sequelize model to query the database
  Product.findAll({
    where: filterCriteria,
  })
    .then((products) => {
      res.json({
        status: true,
        data_filter: products,
        message: "This is your result.",
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

module.exports = filterMiddleware;
