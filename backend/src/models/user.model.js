const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ["admin", "manager", "viewer"], default: "viewer" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
