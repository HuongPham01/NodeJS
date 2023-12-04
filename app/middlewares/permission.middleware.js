const jwt = require("jsonwebtoken");
const checkListRole = (role, userRole) => {
  var check = role.find(item => {
    return item === userRole;
  });
  if (check) {
    return true;
  } else {
    return false;
  }
}
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
          console.log("Decoded:", decoded)
        } else {
          // Token is valid, and decoded contains the decoded payload
          console.log("Token is valid:", decoded);
          console.log(role, decoded.role);
          console.log(checkListRole(role, decoded.role));
          if (checkListRole(role, decoded.role)) {
            next();
          } else {
            res.send("Bạn không có quyền truy cập tài nguyên này!!!");
          }
        }
      });
    }
  }
};

module.exports = permissionMiddleware;
