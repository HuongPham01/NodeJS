const sql = require("./db.js");
const bcrypt = require("bcrypt");

// Constructor
const Test = function (user) {
  this.name = user.name;
  this.email = user.email;
  // this.password = user.password;
  this.password = bcrypt.hashSync(user.password, 10);
  this.role = user.role;
};

//GET ALL USER
Test.getAll = (result) => {
  let query = "SELECT * FROM users";

  // if (email) {
  //   query += ` WHERE email LIKE '%${email}%'`;
  // }

  sql.query(query, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("users: ", res);
    result(null, res);
  });
};

//FIND USER HAS ROLE ADMIN
Test.findByRole = (role, result) => {
  sql.query("SELECT * FROM users WHERE role = ?", role, (err, res) => {
    if (err) {
      console.error("Error querying database:", err);
      result(err, null);
      return;
    }

    // Found users with the role
    result(null, res);
  });
};
module.exports = Test;
