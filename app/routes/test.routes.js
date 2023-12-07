const express = require("express");
var router = express.Router();
const tests = require("../controllers/test.controller");

module.exports = (app) => {
  app.use("/api/tests", router);
  router.post("/nSum", tests.Nsum);
  router.post("/findMin", tests.FindMin);
  router.get("/getUsers", tests.findAll);
  router.get("/getAdmins", tests.findAdmin);
};
