const {
  selectAllArticles,
  selectArticleByID,
} = require("../models/articlesModel");

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
      console.log(article)
    })
    .catch((err) => {
      next(err);
    });
};
