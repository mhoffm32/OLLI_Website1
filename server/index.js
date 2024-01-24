const express = require("express");
const app = express();
const port = 3001;
const fs = require("fs");
const path = require("path");
const router = express.Router();

app.use("/");
app.use("/api", router);
app.use(express.json());
router.use(express.json());
