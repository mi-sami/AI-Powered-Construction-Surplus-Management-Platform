const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
  },
  { timestamps: true, strict: false, collection: "orders" },
);

module.exports = mongoose.model("Project", projectSchema);
