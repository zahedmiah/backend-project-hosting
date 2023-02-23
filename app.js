const { getAllTopics } = require("./controllers/topicController");
const {
  getAllArticles,
  getArticleByID,
} = require("./controllers/articleController");

const express = require("express");
const app = express();

const {
  errorHandler404,
  errorHandler500,
  errorHandler400
} = require("./controllerErrorHandler");

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/topics", getAllTopics); //create router
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleByID)
console.log(getArticleByID)
app.use(errorHandler400);
app.all(`/*`, errorHandler404);
app.use(errorHandler500); //final

module.exports = app;
