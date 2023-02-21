const { getAllTopics } = require("./controllers/topicController");
const express = require("express");
const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/topics", getAllTopics);

module.exports = app;
