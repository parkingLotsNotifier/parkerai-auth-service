const User = require("../models/User");
const bcrypt = require("bcrypt");
const { AUTH_MAX_AGE } = require("../config/env");
const {
  createAccessToken,
  createRefreshToken,
} = require("../helpers/tokenHelper");
const handleErrors = require("../helpers/errorHelper");

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  try {
    if (!user._id) return res.sendStatus(403).json("incorrect Email");
    else {
      const auth = await bcrypt.compare(password, user.password);
      if (!auth) {
        return res.sendStatus(403).json({ error: "incorrect password" });
      } else if (auth) {
        const refreshToken = createRefreshToken(email);
        const accessToken = createAccessToken(email, { role: user.role });
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookies for JWT
        // httpOnly coockie is not avalable to JS
        //TODO: on production use secure: true , this allowed the use of https
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: AUTH_MAX_AGE * 1000,
          sameSite: "None",
        });

        // Send success message
        res.status(200).json({ userId: user.id, accessToken });
      }
    }
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json({ errors });
  }
};

module.exports = { loginHandler };
