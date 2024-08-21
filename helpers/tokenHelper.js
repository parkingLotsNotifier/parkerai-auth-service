const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_MAX_AGE,REFRESH_TOKEN_MAX_AGE ,AUTH_JWT_SECRET ,REFRESH_JWT_SECRET} = require("../config/env");

//TODO: what algorithem use in the creation of jwt ?
const createAccessToken = (email,role) => {
  return jwt.sign({ email,role }, AUTH_JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_MAX_AGE,
  });
};
const createRefreshToken = (email) => {
  return jwt.sign({ email }, REFRESH_JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_MAX_AGE,
  });
};

module.exports = { createAccessToken, createRefreshToken };
