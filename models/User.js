const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
    validate: {
      validator: function (v) {
        return v && v.trim().length > 0;
      },
      message: "Please enter numbers/letters ",
    },
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  refreshToken: [
    {
      type: String,
      required: true,
      unique: true,
    },
  ],
  role: {
    type: String,
    enum: {
      values: ["user", "parkingLotOwner", "admin", "developer"],
      message:
        'User role must be either "user" or "parkingLotOwner" or "admin"',
    },
    default: "user",
  },
  parkingLots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingLot",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
