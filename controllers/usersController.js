const { selectAllUsers } = require("../models/usersModel");


exports.getAllUsers = (req, res, next) => {
    selectAllUsers()
      .then((result) => {
        res.status(200).send({ result });
      })
      .catch((err) => {
        next(err);
      });
  };