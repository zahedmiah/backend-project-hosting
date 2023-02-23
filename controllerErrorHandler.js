const { response } = require("./app");

exports.errorHandler404 = (req, res, next) => {
  res.status(404).send({ msg: "404 Not Found" });
};

exports.errorHandler500 = (err, req, res, next) => {
  res.status(500).send({ msg: "500 Internal Server Error" });
};
