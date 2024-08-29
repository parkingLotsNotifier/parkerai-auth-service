const User = require("../models/User");
const bcrypt = require("bcrypt");
const { REFRESH_TOKEN_MAX_AGE } = require("../config/env");
const {
  createAccessToken,
  createRefreshToken,
} = require("../helpers/tokenHelper");
const handleErrors = require("../helpers/errorHelper");

// auth controller
const loginHandler = async (req, res) => {
  const cookies = req.cookies;
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(403).json("incorrect Email");
    else {
      const auth = await bcrypt.compare(password, user.password);
      if (!auth) {
        return res.status(403).json({ error: "incorrect password" });
      } else if (auth) {
        // user entered valid information
        const newRrefreshToken = createRefreshToken(email);
        let newRefreshTokenArray = !cookies?.jwt
          ? user.refreshToken
          : user.refreshToken.filter((rt) => rt !== cookies.jwt);
        if (cookies?.jwt) {
          // if user logs in but never user the refreshToken and does not logout and its
          // refreshToken is stolen we also need reuse detection as in refreshHandler
          const hackedUser = await User.findOne({
            refreshToken: cookies.jwt,
          }).exec();

          if (!hackedUser) {
            newRefreshTokenArray = [];
          }

          // clear the refreshToken in the cookie
          res.clearCookie("jwt", {
            httpOnly: true,
            secure: false,
            maxAge: REFRESH_TOKEN_MAX_AGE * 1000,
            sameSite: "Lax",
             path:'/'
          });
        }
        const accessToken = createAccessToken(email, { role: user.role });
        user.refreshToken = [...newRefreshTokenArray, newRrefreshToken];
        await user.save();

        // Set cookies for JWT
        // httpOnly coockie is not avalable to JS
        //TODO: on production use secure: true , this allowed the use of https
        res.cookie("jwt", newRrefreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: REFRESH_TOKEN_MAX_AGE * 1000,
          sameSite: "Lax",
          path:'/'
        });
        console.log("login coockie sent");

        // Send success message
        res.status(200).json({ userId: user._id, accessToken });
        console.log("status 200");
      }
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports = { loginHandler };
