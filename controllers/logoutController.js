const User = require("../models/User");
const { REFRESH_TOKEN_MAX_AGE } = require("../config/env");
const handleErrors = require("../helpers/errorHelper");

const logoutHandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content to send back

  const refreshToken = cookies.jwt;
  console.log("🚀 ~ logoutHandler ~ refreshToken:", refreshToken);

  if (!refreshToken) return res.sendStatus(204); // Ensure refreshToken is defined

  try {
    // Find user by refreshToken
    const user = await User.findOne({ refreshToken: refreshToken }).exec();

    if (!user) {
      console.log("No user found with this refreshToken");
      return res.sendStatus(204); // No user found, nothing to delete
    }
    
    // Filter out the refreshToken
    user.refreshToken = user.refreshToken.filter(
      (rt) => rt && rt === refreshToken
    );

    await user.save();

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: REFRESH_TOKEN_MAX_AGE * 1000,
      sameSite: "Lax",
      path: "/",
    });

    return res.sendStatus(204);
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(400).json({ errors: "Logout failed due to server error." });
  }
};

module.exports = { logoutHandler };
