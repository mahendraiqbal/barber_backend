const usersModel = require("../models/user");
const responseHelper = require("../helpers/responseHelper");

const getDataUsers = (req, res) => {
  const { id } = req.userInfo;
  console.log("[DEBUG] userInfo", id);
  usersModel
    .getDataUsers(id)
    .then(({ status, result }) => {
      responseHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      responseHelper.error(res, status, err);
    });
};

const patchDataUsers = (req, res) => {
  const { body } = req;
  const { id } = req.userInfo;
  let saveImage;

  console.log(req.file);

  if (req.file) {
    saveImage = {
      ...body,
      image: req.file.filename,
    };
  } else {
    saveImage = { ...body };
  }

  usersModel
    .patchDataUsers(saveImage, id)
    .then(({ status }) => {
      res.status(status).json({
        msg: "Data Updated",
        result: {
          ...saveImage,
        },
      });
      // responseHelper(res, status, result);
    })
    .catch(({ status, err }) => {
      responseHelper.error(res, status, err);
    });
};

const patchPasswordUsers = (req, res) => {
  const { body } = req;
  const { id } = req.userInfo;

  usersModel
    .patchPasswordUsers(body, id)
    .then(({ status }) => {
      responseHelper.success(res, status, {
        msg: "Password Updated",
        id,
      });
    })
    .catch(({ status, err }) => {
      if (status == 401)
        return responseHelper.error(res, status, "Password invalid");
      responseHelper.error(res, status, err);
    });
};

module.exports = {
  getDataUsers,
  patchDataUsers,
  patchPasswordUsers,
};
