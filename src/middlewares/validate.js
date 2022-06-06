const responseHelper = require("../helpers/responseHelper");

const register = (req, res, next) => {
  const { body } = req;
  const registerBody = ["name", "email", "password"];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    registerBody.filter((property) => !bodyProperty.includes(property))
      .length == 0
      ? true
      : false;
  if (!isBodyValid) return responseHelper.error(res, 400, "Invalid Body");
  next();
};

const login = (req, res, next) => {
  // Validasi body
  const { body } = req;
  const loginBody = ["email", "password"];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    loginBody.filter((property) => !bodyProperty.includes(property)).length == 0
      ? true
      : false;

  if (!isBodyValid) return responseHelper.error(res, 400, "Invalid Body");
  next();
};

module.exports = { register, login };
