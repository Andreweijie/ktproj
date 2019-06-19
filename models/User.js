const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  verToken: {
    type: String
  },
  resetToken: {
    type: String
  },
  isVerified: {
    type: Boolean
  }
});
module.exports = User = mongoose.model("users", UserSchema);
