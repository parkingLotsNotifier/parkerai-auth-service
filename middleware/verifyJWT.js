const jwt = require("jsonwebtoken");
const { AUTH_JWT_SECRET } = require("../config/env");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, AUTH_JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // invalid token
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  });
};

module.exports = { verifyJWT };
