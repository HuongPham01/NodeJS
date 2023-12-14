const sql = require("../models/db");

const sortMiddleware = (req, res) => {
  // Get value of param from URL
  const sortParam = req.query.budget;

  // Test param is valid
  // If valid, set the sortOrder value to the sort parameter value, otherwise null
  const sortOrder = isValidSortOrder(sortParam)
    ? sortParam.toLowerCase()
    : null;

  const productQuery = "SELECT * FROM products";
  sql.query(productQuery, (productErr, productRes) => {
    if (productErr) {
      return res.status(500).json({ error: productErr.message });
    }

    //Create a coppy of products array to avoid affecting the original array
    let sortedProducts = [...productRes];

    // Test sort or not
    if (sortOrder) {
      // Nếu có thực hiện sắp xếp dựa trên sortOrder
      sortedProducts.sort((a, b) => {
        return sortOrder === "desc" ? b.price - a.price : a.price - b.price;
      });
    }

    // Return list products (sorted, ortherwise return empty array)
    res.json({
      status: true,
      data_sort: sortedProducts,
      message: "This is your result.",
    });
  });
};

// Function check validity of sortOrder
const isValidSortOrder = (sortOrder) => {
  const validOrders = ["asc", "desc"];
  return validOrders.includes(sortOrder?.toLowerCase());
};

module.exports = sortMiddleware;
