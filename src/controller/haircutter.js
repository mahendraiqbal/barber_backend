const haircutterModel = require("../models/haircutter");
const responseHelper = require("../helpers/responseHelper");

const paginatedHaircutter = (req, res) => {
  const { query } = req;
  const order = query.order;
  let keyword = "";
  if (query.name) keyword = `%${query.name}%`;
  haircutterModel
    .paginatedHaircutter(query, keyword, order)
    .then(({ status, result }) => {
      responseHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      responseHelper.error(res, status, err);
    });
};

module.exports = {
  paginatedHaircutter,
};
