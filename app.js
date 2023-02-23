const { getAllTopics } = require("./controllers/topicController");
const { getAllArticles } = require("./controllers/articleController");

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
app.get("/api/articles", getAllArticles);

const topicName = "topicz";
app.use(`/api/:topicName`, errorHandler404);

app.use(errorHandler500); //final

module.exports = app;
