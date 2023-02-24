const { use } = require("../app");
const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db
    .query(
      `
        SELECT articles.author,
               articles.title,
               articles.article_id,
               articles.topic,
               articles.created_at,
               articles.votes,
               articles.article_img_url,
               COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
      `
    )
    .then((result) => {
      return result.rows.map((row) => {
        return {
          author: row.author,
          title: row.title,
          article_id: row.article_id,
          topic: row.topic,
          created_at: row.created_at,
          votes: row.votes,
          article_img_url: row.article_img_url,
          comment_count: parseInt(row.comment_count),
        };
      });
    });
};

exports.selectArticleByID = (article_id) => {
  const queryValues = [article_id];

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments on comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `no article found for article_id${article_id}`,
        });
      }
      return result.rows[0];
    });
};

exports.pushComment = (article_id, newComment) => {
  const { username, body } = newComment;
  const queryValues = [username, body, article_id];

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
      queryValues
    )
    .then((result) => {
      if(!result.rows.length) return Promise.reject({
        status: 404,
        msg: `no article found for article_id ${article_id}`,
      });
      return result.rows[0];
    })
    .catch((err) => {
      if (err.code === "23503") {
        return Promise.reject({
          status: 404,
          msg: `no author found for author ${username}`
        });
      } else {
        console.log(err, "<<<<<<<<<< model err")
        throw err;
      }
    });
};