const authMiddleware = require("../middlewares/auth.middleware");
const permissionMiddleware = require("../middlewares/permission.middleware");
const users = require("../controllers/user.controller");
var router = require("express").Router();

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new User/signup user
  router.post("/", permissionMiddleware(["admin"]), users.create);

  // Retrieve all Users
  router.get("/", authMiddleware, users.findAll);

  // Retrieve a single User with id
  router.get("/:id", permissionMiddleware(["admin"], ["user"]), users.findOne);

  // Update a User with id
  router.put("/:id", permissionMiddleware(["admin"]), users.update);

  // Delete a User with id
  router.delete("/:id", permissionMiddleware(["admin"]), users.delete);

  // Delete all Users
  // router.delete("/", users.deleteAll);

  //login user
  router.post("/login", users.login);

  app.use("/api/users", router);
};
