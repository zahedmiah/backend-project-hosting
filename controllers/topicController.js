const { getAllTopicObjects } = require("../models/topicsModel");

exports.getAllTopics = (res, req, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics: result });
    })
    .catch((err) => {
      next(err);
    });
};
