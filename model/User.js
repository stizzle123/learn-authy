const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    countryCode: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    authyId: String
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", userSchema);
