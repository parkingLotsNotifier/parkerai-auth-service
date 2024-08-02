const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { AUTH_JWT_SECRET } = require('../config/env')

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, AUTH_JWT_SECRET, {
    expiresIn: maxAge
  });
};

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// controller actions
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'Logged out' });
}

// Camera-related actions
module.exports.register_camera = async (req, res) => {
  const userId = req.user._id;
  const { cameraId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user.cameraIds.includes(cameraId)) {
      user.cameraIds.push(cameraId);
      await user.save();
      res.status(200).json({ message: 'Camera registered successfully', cameraIds: user.cameraIds });
    } else {
      res.status(400).json({ message: 'Camera already registered' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.remove_camera = async (req, res) => {
  const userId = req.user._id;
  const { cameraId } = req.body;

  try {
    const user = await User.findById(userId);
    user.cameraIds = user.cameraIds.filter(id => id !== cameraId);
    await user.save();
    res.status(200).json({ message: 'Camera removed successfully', cameraIds: user.cameraIds });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.check_camera = async (req, res) => {
  const userId = req.user._id;
  const { cameraId } = req.body;

  try {
    const user = await User.findById(userId);
    if (user.cameraIds.includes(cameraId)) {
      res.status(200).json({ message: 'Camera is registered' });
    } else {
      res.status(404).json({ message: 'Camera not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
