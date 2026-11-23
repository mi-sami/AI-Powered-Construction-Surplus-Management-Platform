const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const repo = require("./repositories/base.repository");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.get("/", (req, res) => {
  res.send("Construction Surplus Platform Server is running!");
});

app.get("/:target", async (req, res) => {
  try {
    const items = await repo.getAll(req.params.target);
    res.send(items);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/:target", async (req, res) => {
  try {
    const newItem = await repo.create(req.params.target, req.body);
    res.status(201).send(newItem);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const handleUpdate = async (req, res) => {
  try {
    const updated = await repo.updateById(
      req.params.target,
      req.params.id,
      req.body,
    );
    res.send(updated);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
app.patch("/:target/:id", handleUpdate);
app.put("/:target/:id", handleUpdate);

app.delete("/:target/:id", async (req, res) => {
  try {
    const deleted = await repo.deleteById(req.params.target, req.params.id);
    res.send(deleted);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});