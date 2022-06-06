const historyModel = require("../models/history");
const responseHelper = require("../helpers/responseHelper");

const getDataHistory = (req, res) => {
  historyModel
    .getDataHistory()
    .then(({ status, result }) => {
      responseHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      responseHelper.error(res, status, err);
    });
};

const insertDataHistory = (req, res) => {
  const { body } = req;
  historyModel
    .insertDataHistory(body)
    .then(({ status, result }) => {
      res.status(status).json({
        msg: "Berhasil",
        result: {
          ...body,
          id: result.insertId,
        },
      });
    })
    .catch(({ status, err }) => {
      responseHelper.error(res, status, err);
    });
};

const deleteDataHistory = (req, res) => {
  const { params } = req;
  const historyId = params.id;
  historyModel
    .deleteDataHistory(historyId)
    .then(({ status, result }) => {
      res.status(status).json({
        msg: "Transaction Telah Dihapus",
        id: result.insertId,
      });
    })
    .catch(({ status, err }) => {
      responseHelper.error(res, status, err);
    });
};

module.exports = {
  getDataHistory,
  insertDataHistory,
  deleteDataHistory,
};
