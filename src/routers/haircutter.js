const express = require("express");

const haircutterController = require("../controller/haircutter");
const authorize = require("../middlewares/authorize");

const haircutterRouter = express.Router();

const upload = require("../middlewares/upload");

haircutterRouter.get("/", haircutterController.paginatedHaircutter);

module.exports = haircutterRouter;
