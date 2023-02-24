const { getAllTopics } = require("./controllers/topicController");
const {
  getAllArticles,
  getArticleByID,
  getArticleComments,
  postComment,
} = require("./controllers/articleController");

const express = require("express");
const app = express();


const {
  errorHandler404,
  errorHandler500,
  customerErrorHandler
} = require("./controllerErrorHandler");

app.use(express.json());

app.post("/api/articles/:article_id/comments", postComment)

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});
app.get("/api/topics", getAllTopics); //create router
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles/:article_id/comments", getArticleComments)
app.all(`/*`, errorHandler404);
app.use(customerErrorHandler);
app.use(errorHandler500); //final
console.log(errorHandler500)

module.exports = app;