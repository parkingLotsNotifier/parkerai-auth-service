const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  createRefreshToken,
  createAccessToken,
} = require("../helpers/tokenHelper");
const { REFRESH_JWT_SECRET, REFRESH_TOKEN_MAX_AGE } = require("../config/env");

// for every new access token generate new refresh token
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  console.log("refresh jwt ibn cookie:", refreshToken)

  // Delete the refreshToken in db
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false,
    maxAge: REFRESH_TOKEN_MAX_AGE * 1000,
    sameSite: "None",
  });
  const user = await User.findOne({ refreshToken: refreshToken }).exec();
 
  // refresh token recived within the cookie BUT it is no longer valid there are two resons
  if (!user) {
    jwt.verify(refreshToken, REFRESH_JWT_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403); // 1. the refresh token is expired

      // 2. detect reuse of refreshToken which mean user has been hacked
      const hackedUser = await User.findOne({ email: decoded.email }).exec();
      hackedUser.refreshToken = [];
      await hackedUser.save();
    });

    return res.sendStatus(403);
  }

  const newRefreshTokenArray = user.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  //evaluate jwt
  jwt.verify(refreshToken, REFRESH_JWT_SECRET, async (err, decoded) => {
    if (err) {
      // found the User, the Refresh token was expired
      user.refreshToken = [...newRefreshTokenArray];
      await user.save();
    }

    if (err || user.email !== decoded.email) return res.sendStatus(403);

    // Refresh token was still valid
    const accessToken = createAccessToken({
      email: decoded.email,
      role: user.role,
    });

    const newRefreshToken = createRefreshToken(user.email);
    user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await user.save();

    // Set cookies for JWT
    // httpOnly coockie is not avalable to JS
    //TODO: on production use secure: true , this allowed the use of https
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: REFRESH_TOKEN_MAX_AGE * 1000,
      sameSite: "None",
    });

    return res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
