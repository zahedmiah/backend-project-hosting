const { selectAllArticles } = require("../models/articlesModel");

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};
