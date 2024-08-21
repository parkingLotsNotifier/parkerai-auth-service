const jwt = require("jsonwebtoken");
const { AUTH_MAX_AGE ,AUTH_JWT_SECRET ,REFRESH_JWT_SECRET} = require("../config/env");

//TODO: what algorithem use in the creation of jwt ?
const createAccessToken = (email,role) => {
  return jwt.sign({ email,role }, AUTH_JWT_SECRET, {
    expiresIn: "15m",
  });
};
const createRefreshToken = (email) => {
  return jwt.sign({ email }, REFRESH_JWT_SECRET, {
    expiresIn: AUTH_MAX_AGE,
  });
};

module.exports = { createAccessToken, createRefreshToken };
