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
