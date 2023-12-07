const jwt = require("jsonwebtoken");
const checkUserRole = (role, userRole) => {
  return Array.isArray(role) && role.includes(userRole);
};

const permissionMiddleware = (role) => {
  // console.log("Check role", role);
  return (req, res, next) => {
    // console.log(role);
    const authHeader = req.headers.authorization;
    console.log("authHeader: ", authHeader);
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("Token: ", token);
      jwt.verify(token, "JWT_secret_key", (err, decoded) => {
        if (err) {
          console.log("Error decoding token:", err);
          res.status(401).send("Unauthorized");
        } else {
          // Token is valid, and decoded contains the decoded payload
          console.log("Token is valid:", decoded);
          console.log(role, decoded.role);
          console.log(checkUserRole(role, decoded.role));
          if (checkUserRole(role, decoded.role)) {
            next();
          } else {
            res
              .status(403)
              .send("Bạn không có quyền truy cập tài nguyên này!!!");
          }
        }
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  };
};

module.exports = permissionMiddleware;
