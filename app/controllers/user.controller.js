const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Tạo salt và băm mật khẩu
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      // Lưu giữ 'hash' vào cơ sở dữ liệu
      console.log("Mật khẩu đã mã hóa là: ", hash);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      // Save User in the database
      User.create(user, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        else res.send(data);
      });
    });
  });

};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
  // const email = req.query.email;

  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else res.send(data);
  });
};

// Find a single User by Id
exports.findOne = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  User.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.id,
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

// Update a Tutorial identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  User.updateById(req.params.id, new User(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating User with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

//Login user
exports.login = (req, res) => {
  //Tương tác với CSDL
  User.login(req.body.email, req.body.password, (key) => {
    if ((key.status === true)) {
      res.json({ message: key.message, success: true });
    } else {
      res.json({ message: key.message, success: false });
    }
  });
};
