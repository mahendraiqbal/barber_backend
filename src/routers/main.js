const express = require("express");
const mainRouter = express.Router();

const authRouter = require("./auth");
const userRouter = require("./user");
const haircutterRouter = require("./haircutter");
const historyRouter = require("./history");

mainRouter.use("/auth", authRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/haircutter", haircutterRouter);
mainRouter.use("/history", historyRouter);

module.exports = mainRouter;
