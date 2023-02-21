const express = require("express");
const app = express();

app.get("/api/topics/", (req, res) => {
  const topics = [
    {
      description: "The man, the Mitch, the legend",
      slug: "mitch",
    },
    {
      description: "Not dogs",
      slug: "cats",
    },
    {
      description: "what books are made of",
      slug: "paper",
    },
  ];
  res.json({ topics });
});

module.exports = app;
