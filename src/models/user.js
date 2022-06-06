const db = require("../config/db");
const bcrypt = require("bcrypt");

const getDataUsers = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT name, email, image, id FROM user WHERE id = ?";
    db.query(sqlQuery, id, (err, result) => {
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

const patchDataUsers = (saveImage, id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `UPDATE user SET ? WHERE id = ?`;
    db.query(sqlQuery, [saveImage, id], (err, result) => {
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

const patchPaswordUsers = (body, id) => {
  return new Promise((resolve, reject) => {
    const { pass, newPass } = body;
    const sqlQuery = `SELECT * FROM user WHERE id = ?`;
    db.query(sqlQuery, [id], async (err, result) => {
      if (err) return reject({ status: 500, err });

      try {
        const hashPassword = result[0].password;
        const checkPassword = await bcrypt.compare(pass, hashPassword);
        if (!checkPassword) return reject({ status: 401, err });

        const sqlQuery = `UPDATE user SET password = ? WHERE id = ?`;
        bcrypt
          .hash(newPass, 10)
          .then((hashPassword) => {
            const password = hashPassword;

            db.query(sqlQuery, [password, id], (err, result) => {
              if (err) return reject({ status: 500, err });
              return resolve({ status: 200, result });
            });
          })
          .catch((err) => {
            reject({ status: 500, err });
          });
      } catch (err) {
        reject({ status: 500, err });
      }
    });
  });
};

module.exports = {
  getDataUsers,
  patchDataUsers,
  patchPaswordUsers,
};
