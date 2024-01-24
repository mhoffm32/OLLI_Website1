const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  console.log("in index.js");
  res.json("hey");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
