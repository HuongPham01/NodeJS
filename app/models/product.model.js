const sql = require("./db.js");
const bcrypt = require("bcrypt");

// Constructor
const User = function (user) {
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
};

//Create

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

//FindOne
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

//FindAll
User.getAll = (result) => {
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

//Delete by Id
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

//Update
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

//LOGIN
User.login = (email, password, callback) => {
  // console.log("model email: ", email);
  // console.log("model password: ", password);
  sql.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
    console.log("Dữ liệu sau khi tìm thấy email là: ", res[0].password);
    if (res.length > 0) {
      // So sánh mật khẩu đã nhập với 'hash' trong cơ sở dữ liệu
      const plainTextPassword = password;
      const hashedPasswordFromDatabase = res[0].password;
      bcrypt.compare(
        plainTextPassword,
        hashedPasswordFromDatabase,
        function (err, result) {
          if (result) {
            var userNoPassword = res[0];
            delete userNoPassword.password;
            callback({
              message: "Đăng nhập thành công!!!",
              status: true,
              data: userNoPassword,
            });
          } else {
            callback({ message: "Đăng nhập thất bại!!!", status: false });
          }
        }
      );
    } else {
      callback({ message: "Tài khoản không tồn tại!!!", status: false });
    }
    if (err) {
      console.log("error: ", err);
      callback(null, err);
      return;
    }
  });
};

module.exports = User;
