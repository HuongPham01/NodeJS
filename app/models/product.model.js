const sql = require("./db.js");

// Constructor
const Product = function (product) {
  this.name = product.name;
  this.description = product.description;
  this.size = product.size;
  this.color = product.color;
  this.price = product.price;
  this.quantity = product.quantity;
};

//Create Product

Product.create = (newProduct, result) => {
  sql.query("INSERT INTO Products SET ?", newProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Product: ", { id: res.insertId, ...newProduct });
    result(null, { id: res.insertId, ...newProduct });
  });
};

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

//FindAll
// Product.getAll = (result) => {
//   let query = "SELECT * FROM Products";

//   sql.query(query, (err, res) => {
//     if (err) {
//       result(null, err);
//       return;
//     }
//     // console.log("Products: ", res);
//     result(null, res);
//   });
// };

// // Pagination
// Product.pagination = (limit, offset) => {
//   return new Promise((resolve, reject) => {
//     sql.query(
//       "SELECT * FROM products LIMIT ?, ?", // Use placeholders for limit and offset
//       [offset, limit], // Pass offset and limit as parameters
//       (err, results) => {
//         if (err) {
//           console.error(err);
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       }
//     );
//   });
// };

// Combined Model Function
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
