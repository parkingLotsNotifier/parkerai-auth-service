const User = require("../models/User");
const { AUTH_MAX_AGE } = require("../config/env");
const handleErrors = require("../helpers/errorHelper");

const logoutHandler = async (req, res) => {
  // on client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // succesfull, No content to send back
  const refreshToken = cookies.jwt;

  try {
    // is refresh token in db ?
    const user = await User.findOne({ refreshToken: refreshToken });
    if (user._id) {
      user.refreshToken = " ";
      await user.save();
    }

    // Delete the refreshToken in db
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      maxAge: AUTH_MAX_AGE * 1000,
      sameSite: "None",
    });

    return res.sendStatus(204);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports = { logoutHandler };
