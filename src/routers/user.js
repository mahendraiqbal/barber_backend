const express = require("express");

const userController = require("../controller/user");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");

const userRouter = express.Router();

userRouter.get("/", authorize.checkToken, userController.getDataUsers);

userRouter.patch(
  "/",
  authorize.checkToken,
  upload,
  userController.patchDataUsers
);

userRouter.patch("/edit-password");

module.exports = userRouter;
