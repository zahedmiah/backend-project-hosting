const {
  getAllTopicObjects,
  getAllArticleObjects,
} = require("../models/topicsModel");

exports.getAllTopics = (req, res) => {
  getAllTopicObjects().then((result) => {
    res.status(200).send({ topics: result });
  });
};
