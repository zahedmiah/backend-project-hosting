const { getAllTopics } = require("./controllers/topicController");
const express = require("express");
const app = express();

const {
  errorHandler404,
  errorHandler500,
} = require("./controllerErrorHandler");

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/topics", getAllTopics); //create router

const topicName = "topicz";
app.use(`/api/${topicName}`, errorHandler404);

app.use(errorHandler500); //final

module.exports = app;
