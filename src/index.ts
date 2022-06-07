import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/webhooks", (req, res) => {
  console.log(req.header("X-GitHub-Event"));
  res.status(200).send({});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
