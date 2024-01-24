const express = require("express");
const app = express();
const port = 3001;
const fs = require("fs");
const path = require("path");
const router = express.Router();

app.use("/api", router);
app.use(express.json());
router.use(express.json());

app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
