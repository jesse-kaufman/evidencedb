// JWT Authentication middleware

const jwt = require("jsonwebtoken");
const { secretKey } = require("./config");

const generateToken = (userId) => {
  const token = jwt.sign(userId, secretKey, { expiresIn: "1h" });
  return token;
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Add the decoded information to the request object
    req.user = decoded;
    next();
  });
};

module.exports = { generateToken, verifyToken };
