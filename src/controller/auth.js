const authModel = require("../models/auth");
const responseHelper = require("../helpers/responseHelper");

const register = (req, res) => {
  const { body } = req;
  const email = body.email;
  authModel
    .createNewUser(body, email)
    .then(({ status, result }) => {
      const objResponse = {
        id: result.insertId,
        name: body.name,
        email: body.email,
      };
      responseHelper.success(res, status, objResponse);
    })
    .catch(({ status, err }) => {
      console.log(err);
      if (status == 400) return responseHelper.error(res, status, err);
      responseHelper.error(res, status, err);
    });
};

const login = (req, res) => {
  const { body } = req;

  authModel
    .loginUser(body)
    .then(({ status, result }) => {
      responseHelper.success(res, status, {
        msg: "Login Succesfull",
        data: result,
      });
    })
    .catch(({ status, err }) => {
      responseHelper.error(res, status, err);
    });
};

const logout = (req, res) => {
  const token = req.header("x-access-token");
  //   console.log('token', token)
  authModel
    .logoutUser(token)
    .then(({ status }) => {
      return responseHelper.success(res, status, {
        msg: "Success",
      });
    })
    .catch(({ status, err }) => {
      responseHelper.error(res, status, err);
    });
};

const forgotPassword = (req, res) => {
  const { body } = req;

  authModel
    .forgotPassword(body)
    .then(({ status, result }) => {
      responseHelper.success(res, status, {
        msg: "OTP",
        data: result,
      });
    })
    .catch(({ status, err }) => {
      console.log(err);
      responseHelper.error(res, status, err);
    });
};

const checkOTP = (req, res) => {
  const { body } = req;

  authModel
    .checkOTP(body)
    .then(({ status, result }) => {
      responseHelper.success(res, status, {
        msg: "OTP is valid",
        data: result,
      });
    })
    .catch(({ status, err }) => {
      console.log(err);
      responseHelper.error(res, status, err);
    });
};

const resetPassword = (req, res) => {
  const { body } = req;

  authModel
    .resetPassword(body)
    .then(({ status }) => {
      responseHelper.success(res, status, {
        msg: "Password updated successfully",
        data: body.email,
      });
    })
    .catch(({ status, err }) => {
      console.log(err);
      responseHelper.error(res, status, err);
    });
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  checkOTP,
  resetPassword,
};
