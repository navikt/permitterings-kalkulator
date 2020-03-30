"use strict";
const path = require("path");
const express = require("express");
const helmet = require("helmet");

const server = express();
server.use(helmet());

server.get("/arbeidsgiver-permittering/internal/isAlive", (req, res) =>
  res.sendStatus(200)
);
server.get("/arbeidsgiver-permittering/internal/isReady", (req, res) =>
  res.sendStatus(200)
);

console.log('path.join(__dirname, "build")', path.join(__dirname, "build"));
console.log(
  'path.resolve(__dirname, "build", "index.html")',
  path.resolve(__dirname, "build", "index.html")
);

server.use(
  "/arbeidsgiver-permittering",
  express.static(path.join(__dirname, "build"))
);
server.get("/arbeidsgiver-permittering/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("server listening on port", port);
});
