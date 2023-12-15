const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config1.js");
const { Op } = require("sequelize");

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_path: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

//Create Product
// Product.create = (newProduct, image, result) => {
//   console.log(newProduct);
//   // test product before create new
//   sql.query(
//     "SELECT * FROM Products WHERE name = ?",
//     newProduct.name,
//     (err, res) => {
//       console.log("test product: ", res);
//       console.log("res.length: ", res.length);
//       if (res.length === 0) {
//         sql.query("INSERT INTO Products SET ?", newProduct, (err, res) => {
//           if (err) {
//             console.log("error: ", err);
//             result(err, null);
//             return;
//           }

//           const productId = res.insertId;

//           // Update the product with the image_path
//           sql.query(
//             "UPDATE Products SET image_path = ? WHERE id = ?",
//             [image, productId],
//             (err, res) => {
//               if (err) {
//                 console.log("error updating image_path: ", err);
//                 result(err, null);
//                 return;
//               }

//               console.log("created Product: ", {
//                 id: productId,
//                 ...newProduct,
//                 image_path: image,
//               });
//               result(null, res);
//             }
//           );
//         });
//       } else {
//         result("Couldn't find product", null);
//       }
//     }
//   );
// };

Product.createProduct = async (newProduct, image) => {
  try {
    const existingProduct = await Product.findOne({
      where: { name: newProduct.name },
    });

    if (!existingProduct) {
      const createdProduct = await Product.create(newProduct);
      await createdProduct.update({ image_path: image });
      return createdProduct;
    } else {
      throw new Error("Product already exists");
    }
  } catch (error) {
    console.error("Error creating product:", error.message);
    throw error;
  }
};

// Static method to get all products
Product.getAll = async () => {
  try {
    // Use the Sequelize model to query the database
    const products = await Product.findAll();

    // Return the list of products
    return products;
  } catch (error) {
    console.error("Error getting all products:", error.message);
    throw error;
  }
};

// Static method for pagination
Product.getAllAndPaginate = async (options) => {
  try {
    // Use the Sequelize model to query the database with pagination options
    const products = await Product.findAll({
      limit: options.limit,
      offset: options.offset,
    });

    // Return the paginated list of products
    return products;
  } catch (error) {
    console.error("Error getting paginated products:", error.message);
    throw error;
  }
};

// Static method for sorting and filtering
Product.sortAndFilterProducts = async (sortOptions, filterOptions) => {
  try {
    // Create an object to hold the filtering criteria
    const filterCriteria = {};

    // Build the filter criteria based on the presence of each parameter
    if (filterOptions.name !== undefined && filterOptions.name !== null) {
      filterCriteria.name = { [Op.like]: `%${filterOptions.name}%` };
    }
    if (filterOptions.size !== undefined && filterOptions.size !== null) {
      filterCriteria.size = { [Op.like]: `%${filterOptions.size}%` };
    }
    if (filterOptions.color !== undefined && filterOptions.color !== null) {
      filterCriteria.color = { [Op.like]: `%${filterOptions.color}%` };
    }
    // Add other filtering criteria as needed

    // Use the Sequelize model to query the database
    const products = await Product.findAll({
      logging: console.log,
      where: filterCriteria,
      order: sortOptions
        ? [[sortOptions.sortBy, sortOptions.sortDirection]]
        : [],
    });

    // Return the sorted and filtered list of products
    return products;
  } catch (error) {
    console.error("Error sorting and filtering products: ", error.message);
    throw error;
  }
};

// Existing code for defining the Product model
Product.searchByName = async (searchTerm) => {
  try {
    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
    });

    return products;
  } catch (error) {
    console.error("Error searching products by name:", error.message);
    throw error;
  }
};

//FindOne
Product.findById = async (id) => {
  try {
    const product = await Product.findByPk(id);
    if (product) {
      return product;
    } else {
      throw { kind: "not_found" };
    }
  } catch (error) {
    console.error("Error finding product:", error.message);
    throw error;
  }
};

//Delete by Id
// Product.remove = (id, result) => {
//   sql.query("DELETE FROM Products WHERE id = ?", id, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found Product with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     console.log("deleted Product with id: ", id);
//     result(null, res);
//   });
// };

Product.remove = async (id) => {
  try {
    const result = await Product.destroy({
      where: { id: id },
    });

    if (result === 0) {
      // not found Product with the id
      throw { kind: "not_found" };
    }

    console.log("deleted Product with id: ", id);
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw error;
  }
};

// UpdateById
Product.updateById = async (id, product) => {
  try {
    const result = await Product.update(product, {
      where: { id: id },
    });

    if (result[0] === 0) {
      // not found product with the id
      throw { kind: "not_found" };
    }

    console.log("updated product: ", { id: id, ...product });
    return { id: id, ...product };
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw error;
  }
};

module.exports = Product;
