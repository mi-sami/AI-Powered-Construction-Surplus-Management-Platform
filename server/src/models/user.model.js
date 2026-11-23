const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    type: { type: String, default: "Individual" },
    role: { type: String, default: "user" },
    status: { type: String, default: "pending" },
    nidNo: { type: String },
    tradeLicenseNo: { type: String },
    avatar: { type: String },
  },
  { timestamps: true, strict: false },
);

module.exports = mongoose.model("User", userSchema);
