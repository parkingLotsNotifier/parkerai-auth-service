const User = require("../models/User");
const bcrypt = require("bcrypt");
const { REFRESH_TOKEN_MAX_AGE } = require("../config/env");
const {
  createAccessToken,
  createRefreshToken,
} = require("../helpers/tokenHelper");
const handleErrors = require("../helpers/errorHelper");

const registrationHandler = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);
    const refreshToken = createRefreshToken(email);
    const accessToken = createAccessToken(email, role);

    const user = await User.create({
      username,
      email,
      password: encryptedPassword,
      refreshToken,
      role,
    });

    // Set cookies for JWT and userId
    // httpOnly coockie is not avalable to JS
    //TODO: on production use secure: true , this allowed the use of https
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: REFRESH_TOKEN_MAX_AGE * 1000,
      sameSite: "None",
    });

    // Send Access token along with user id
    res.status(201).json({ accessToken, userId: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports = { registrationHandler };
