const db = require("../config/db");

const getDataHistory = () => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * FROM history";
    db.query(sqlQuery, (err, result) => {
      if (err)
        return reject({
          status: 500,
          err,
        });
      resolve({
        status: 200,
        result,
      });
    });
  });
};

const insertDataHistory = (body) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO history SET ?`;
    db.query(sqlQuery, body, (err, result) => {
      if (err)
        return reject({
          status: 500,
          err,
        });
      resolve({
        status: 200,
        result,
      });
    });
  });
};

const deleteDataHistory = (historyId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `DELETE FROM history WHERE id = ${historyId}`;
    db.query(sqlQuery, (err, result) => {
      if (err)
        return reject({
          status: 500,
          err,
        });
      resolve({
        status: 200,
        result,
      });
    });
  });
};

module.exports = {
  getDataHistory,
  insertDataHistory,
  deleteDataHistory,
};
