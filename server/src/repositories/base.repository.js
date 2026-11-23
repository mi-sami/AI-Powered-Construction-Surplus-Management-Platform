const mongoose = require("mongoose");
const User = require("../models/user.model");
const Material = require("../models/material.model");
const Project = require("../models/project.model");

const getModelByTarget = (target) => {
  if (target === "users") return User;
  if (target === "listings" || target === "materials") return Material;
  if (target === "orders" || target === "projects") return Project;

  if (mongoose.models[target]) return mongoose.models[target];
  const dynamicSchema = new mongoose.Schema(
    { id: { type: String, unique: true } },
    { strict: false, collection: target },
  );
  return mongoose.model(target, dynamicSchema);
};

const getAll = async (target) => {
  const Model = getModelByTarget(target);
  return await Model.find({}).lean();
};

const create = async (target, data) => {
  const Model = getModelByTarget(target);
  const docData = { ...data, id: data.id || `${Date.now()}` };
  const created = await Model.create(docData);
  return created.toObject();
};

const updateById = async (target, id, data) => {
  const Model = getModelByTarget(target);
  const { _id, ...updateFields } = data;
  return await Model.findOneAndUpdate(
    { id: String(id) },
    { $set: updateFields },
    { new: true },
  ).lean();
};

const deleteById = async (target, id) => {
  const Model = getModelByTarget(target);
  return await Model.findOneAndDelete({ id: String(id) }).lean();
};

module.exports = { getAll, create, updateById, deleteById };