const db = require("../db/connection");

exports.getAllTopicObjects = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};
