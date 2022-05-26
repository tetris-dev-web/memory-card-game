require('dotenv').config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { asyncMiddleware } = require("./middlewares/async_middleware");
const {
  getScore,
  getScoreAll,
  saveScore
} = require("./controllers/score_controller");

const port = process.env.PORT || 8090;

const app = express();

app.use(bodyParser.json({ type: "*/*" }));

app.get("/api/helloworld", (req, res) => {
  res.send("API is working. hello world");
});

app.get(
  "/api/score/:difficulty",
  asyncMiddleware(async (req, res) => {
    const { difficulty } = req.params;

    if (difficulty == "" || difficulty == "all")
      getScoreAll().then(response => {
        if (response.length > 0)
          res.send({
            result: "success",
            data : response
          });
        else
          res.send({result: "error"});
      });
    else
      getScore(difficulty).then(response => {
        if (response.length > 0)
          res.send({
            result: "success",
            data : response
          });
        else
          res.send({result: "error"});
      });
  }),
);

app.post(
  "/api/score",
  asyncMiddleware(async (req, res) => {
    const { score, username, difficulty } = req.body;

    await saveScore(score, username, difficulty).then(response => {
      if (response.id)
        res.send({result: "success"});
      else 
        res.send({result: "error"});
    });
  }),
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
}

const server = app.listen(port, () => {
  console.log("listening on port", port);
});
