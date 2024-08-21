const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AUTH_JWT_SECRET, REFRESH_JWT_SECRET } = require("../config/env");


const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user._id) return res.sendStatus(403);

  //evaluate jwt
  jwt.verify(refreshToken, REFRESH_JWT_SECRET, (err, decoded) => {
    if (err || user.email !== decoded.email) return res.sendStatus(403);
    const accessToken = jwt.sign({ email: decoded.email }, AUTH_JWT_SECRET, {
      expiresIn: "15m",
    });
    return res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
