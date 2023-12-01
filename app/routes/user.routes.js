const authMiddleware = require("../middlewares/auth.middleware");
const users = require("../controllers/user.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  var router = require("express").Router();

  // Create a new User/signup user
  router.post("/", users.create);

  // Retrieve all Users
  router.get("/", authMiddleware, users.findAll);

  // Retrieve a single User with id
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // Delete all Users
  // router.delete("/", users.deleteAll);

  //login user
  router.post("/login", users.login);

  app.use("/api/users", router);
};
