const sql = require("./db.js");

// constructor
const User = function (user) {
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found user with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = (result) => {
  let query = "SELECT * FROM users";

  // if (email) {
  //   query += ` WHERE email LIKE '%${email}%'`;
  // }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.remove = (id, result) => {
  sql.query("DELETE FROM Users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted User with id: ", id);
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET name = ?, password = ?, email= ? WHERE id = ?",
    [user.name, user.password, user.email, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

//Login
User.login = (email, password, callback) => {
  console.log("model email: ", email)
  console.log("model password: ", password)
  sql.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, res) => {
      console.log(res)
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }

      if (res.length > 0) {
        callback({message: "Đăng nhập thành công!!!", status: true})
      } else {
        callback({message: "Đăng nhập thất bại!!!", status: false})
      }
    }
  );
}

module.exports = User;
