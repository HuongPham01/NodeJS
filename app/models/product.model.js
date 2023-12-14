const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const Product = sequelize.define("Product", {
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
    type: DataTypes.DECIMAL, // Adjust precision and scale as needed
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_path: {
    type: DataTypes.STRING,
  },
});

//Create Product

Product.create = (newProduct, image, result) => {
  console.log(newProduct);
  // test product before create new
  sql.query(
    "SELECT * FROM Products WHERE name = ?",
    newProduct.name,
    (err, res) => {
      console.log("test product: ", res);
      console.log("res.length: ", res.length);
      if (res.length === 0) {
        sql.query("INSERT INTO Products SET ?", newProduct, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }

          const productId = res.insertId;

          // Update the product with the image_path
          sql.query(
            "UPDATE Products SET image_path = ? WHERE id = ?",
            [image, productId],
            (err, res) => {
              if (err) {
                console.log("error updating image_path: ", err);
                result(err, null);
                return;
              }

              console.log("created Product: ", {
                id: productId,
                ...newProduct,
                image_path: image,
              });
              result(null, res);
            }
          );
        });
      } else {
        result("Couldn't find product", null);
      }
    }
  );
};

module.exports = Product;

//FindOne
Product.findById = (id, result) => {
  sql.query(`SELECT * FROM Products WHERE id = ?`, [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found Product: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Product with the id
    result({ kind: "not_found" }, null);
  });
};

// Pagination and getAll
Product.getAllAndPaginate = (options, result) => {
  let query = "SELECT * FROM products";

  if (options.limit && options.offset !== null) {
    // Paginated query
    query += " LIMIT ? OFFSET ?";
  }

  const params =
    options.limit && options.offset !== null
      ? [options.limit, options.offset]
      : [];

  sql.query(query, params, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Product.getAll = (result) => {
  let query = "SELECT * FROM products";

  sql.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};

//Delete by Id
Product.remove = (id, result) => {
  sql.query("DELETE FROM Products WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Product with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted Product with id: ", id);
    result(null, res);
  });
};

//Update
Product.updateById = (id, product, result) => {
  sql.query(
    "UPDATE products SET name = ?, description = ?, size= ?, color= ?, price= ?, quantity= ? WHERE id = ?",
    [
      product.name,
      product.description,
      product.size,
      product.color,
      product.price,
      product.quantity,
      product.image,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found product with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated product: ", { id: id, ...product });
      result(null, { id: id, ...product });
    }
  );
};

module.exports = Product;
