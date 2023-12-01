const jwt = require("jsonwebtoken");
// CREATE JWT
const createJWT = (user, expires_in) => {
  console.log(user);
  const jwt = require("jsonwebtoken");

  // Payload (dữ liệu chứa trong JWT)
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    // role: "admin"
  };

  // Secret key để ký và xác minh JWT
  const secretKey = "JWT_secret_key";

  // Create  access token
  const token = jwt.sign(payload, secretKey, { expiresIn: expires_in }); // expiresIn là tùy chọn, xác định thời gian hết hạn của token

  console.log("JWT:", token);
  return token;
};
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Hello: ", authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("Access token: ", token);
    const refreshToken = req.body.refreshToken;
    console.log("Refresh token: ", refreshToken);
    jwt.verify(token, "JWT_secret_key", (err, decoded) => {
      if (err) {
        //check refresh token and create new access token when refresh token exists
        jwt.verify(refreshToken, "JWT_secret_key", (err, decoded) => {
          if (err) {
            console.error("Token verification failed:", err.message);
            res.send("Have error: " + err.message);
          } else {
            console.log("Token is valid:", decoded);
            const newAccessToken = createJWT(decoded, "1m");
            //set new header when has new access token
            res.setHeader("authorization", "Bearer " + newAccessToken);
            next();
          }
        });
      } else {
        // Token is valid, and decoded contains the decoded payload
        console.log("Token is valid:", decoded);
        next();
      }
    });
  } else {
    res.send("Have error!!!");
  }
};

module.exports = authMiddleware;
