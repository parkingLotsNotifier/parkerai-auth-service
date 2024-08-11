const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { AUTH_JWT_SECRET } = require("../config/env");

// create json web token
const maxAge = 3 * 24 * 60 * 60;
//TODO: what algorythem use in the creation of jwt ?
const createToken = (id) => {
  return jwt.sign({ id }, AUTH_JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = err.message;


  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// controller actions
module.exports.signup_post = async (req, res) => {
  const { email, password , role } = req.body;

  try {
    const user = await User.create({ email, password , role});
    const token = createToken(user._id);

    // Set cookies for JWT and userId
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.cookie("userId", user._id.toString(), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    // Send success message
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    // Set cookies for JWT and userId
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.cookie("userId", user._id.toString(), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    // Send success message
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("userId", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out" });
};

