const express = require("express");

const historyController = require("../controller/history");
const authorize = require("../middlewares/authorize");

const histroyRouter = express.Router();

histroyRouter.get("/", historyController.getDataHistory);

histroyRouter.post("/", historyController.insertDataHistory);

histroyRouter.delete("/:id", historyController.deleteDataHistory);

module.exports = histroyRouter;
