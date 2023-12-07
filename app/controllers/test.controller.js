const Test = require("../models/test.model.js");

//SUM NUMBERS
exports.Nsum = (req, res, status) => {
  if (status) {
    const number = req.body.number;
    if (number > 0) {
      let sum = 0;
      for (let i = 1; i <= number; i++) {
        sum += i;
      }
      res.send({
        message: `Tổng từ 1 đến ${number} là ${sum}`,
        status: true,
      });
    } else {
      res.send({
        message: `Chúng tôi không tính số âm`,
        status: false,
      });
    }
  } else {
    res.send({ status: false });
  }
};

// FIND NUMBER MIN
exports.FindMin = (req, res) => {
  const arr = req.body && req.body.arr;
  if (!arr || arr.length === 0 || arr.some(isNaN)) {
    return res.status(400).send({ message: "Invalid array", status: false });
  }

  const min = Math.min(...arr);
  res.send({
    message: `Số bé nhất là ${min}`,
    status: true,
  });
};

// GET ALL USER
exports.findAll = (req, res) => {
  const email = req.query.email;

  Test.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else res.send(data);
  });
};

// GET ALL USER ROLE ADMIN

exports.findAdmin = (req, res) => {
  const roleToFind = "admin";

  Test.findByRole(roleToFind, (err, users) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error retrieving users with role admin" });
    } else {
      res.json(users);
    }
  });
};
