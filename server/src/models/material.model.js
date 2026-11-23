const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String },
    category: { type: String },
    specification: { type: String },
    brand: { type: String },
    quantity: { type: Number },
    unit: { type: String },
    price: { type: Number },
    location: { type: String },
    sellerId: { type: String },
    userId: { type: String },
    status: { type: String, default: "available" },
  },
  { timestamps: true, strict: false, collection: "listings" },
);

module.exports = mongoose.model("Material", materialSchema);
