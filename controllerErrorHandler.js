const { response } = require("./app");

exports.errorHandler404 = (req, res, next) => {
  res.status(404).send({ msg: "404 Not Found" });
};

exports.customerErrorHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: "400 Bad Request" });
  } else if (err.status === 404) {
    res.status(404).send({ msg: "404 Not Found" });
  } else {
    next(err);
  }
};
exports.errorHandler500 = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: "500 Internal Server Error" });
};
