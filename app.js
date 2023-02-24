const { getAllTopics } = require("./controllers/topicController");
const {
  getAllArticles,
  getArticleByID,
  getArticleComments,
  postComment,
  apiRequest,
  updatedArticle
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
app.patch("/api/article/:article_id", updatedArticle)

app.get("/api", apiRequest);
app.get("/api/topics", getAllTopics); //create router
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles/:article_id/comments", getArticleComments)
app.all(`/*`, errorHandler404);
app.use(customerErrorHandler);
app.use(errorHandler500); //final

module.exports = app;