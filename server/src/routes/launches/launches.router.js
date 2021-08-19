const express = require("express");
const {
  httpgetAllLaunches,
  httppostNewLaunch,
  httpdeleteLaunch,
} = require("./launches.controller");

const launchesRouter = express();

launchesRouter.get("/", httpgetAllLaunches);
launchesRouter.post("/", httppostNewLaunch);
launchesRouter.delete("/:id", httpdeleteLaunch);

module.exports = launchesRouter;
