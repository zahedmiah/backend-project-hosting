const {
  selectAllArticles,
  selectArticleByID,
  selectArticleComments,
  pushComment,
  updateArticle
} = require("../models/articlesModel");

exports.apiRequest = (req, res) => {
  res.status(200).send({ msg: "all ok" });
}

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
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const commentPush = req.body;
  pushComment(article_id, commentPush)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updatedArticle = (req, res, next) => {
  const { article_id } = req.params;
  const input = req.body;
  updateArticle(article_id, input)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
