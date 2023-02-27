const db = require("../db/connection");

  exports.selectAllUsers = function () {
    const query = `
      SELECT username, name, avatar_url
      FROM users;
    `;

    return db.query(query).then((result) => {
      return result.rows;
    });
  }