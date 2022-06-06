const express = require("express");

const authRouter = express.Router();
const authController = require("../controller/auth");
const validate = require("../middlewares/validate");
const authorize = require("../middlewares/authorize");

authRouter.post("/login", authController.login);
authRouter.post("/register", validate.register, authController.register);
authRouter.delete("/logout", authorize.checkToken, authController.logout);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/checkOTP", authController.checkOTP);
authRouter.post("/reset-password", authController.resetPassword);

module.exports = authRouter;
