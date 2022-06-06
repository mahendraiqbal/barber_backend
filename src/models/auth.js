const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../config/db");
const { sendForgotPass } = require("../helpers/sendForgotPass");

const createNewUser = (body, email) => {
  return new Promise((resolve, reject) => {
    // check email duplicate
    const emailDuplicated = `SELECT email FROM user WHERE email = ?`;
    db.query(emailDuplicated, [email], (err, result) => {
      if (err)
        return reject({
          status: 500,
          err,
        });
      if (result.length >= 1)
        return reject({
          status: 400,
          err: "Email Duplicated",
        });
    });

    const sqlQuery = "INSERT INTO user SET ?";
    bcrypt
      .hash(body.password, 10)
      .then((hashedPassword) => {
        const bodyWithHashedPassword = {
          ...body,
          password: hashedPassword,
          roles_id: 1,
        };
        db.query(sqlQuery, [bodyWithHashedPassword], (err, result) => {
          console.log(bodyWithHashedPassword);
          if (err)
            return reject({
              status: 500,
              err,
            });
          resolve({
            status: 201,
            result,
          });
        });
      })
      .catch((err) => {
        reject({
          status: 500,
          err,
        });
      });
  });
};

const loginUser = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password } = body;
    const sqlQuery = "SELECT * FROM user WHERE ?";

    db.query(sqlQuery, [{ email }], async (err, result) => {
      if (err) return reject({ status: 500, err });
      // untuk cek apakah emailnya ada di db
      if (result.length == 0)
        return reject({
          status: 401,
          err: "Invalid Email/Password",
        });

      try {
        const hashedPassword = result[0].password;
        const checkPassword = await bcrypt.compare(password, hashedPassword);
        console.log(checkPassword);

        // untuk cek apakah password yang diinput sama dgn di db
        if (checkPassword) {
          const payload = {
            id: result[0].id,
            roles_id: result[0].roles_id,
          };
          const jwtOptions = {
            expiresIn: "1d",
            issuer: process.env.ISSUER,
          };
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            jwtOptions,
            (err, token) => {
              if (err) return reject({ status: 500, err });
              const data = {
                token,
                image: result[0].image,
                roles_id: payload.roles_id,
                id: payload.id,
              };
              resolve({ status: 200, result: data });
            }
          );
        } else {
          reject({ status: 401, err: "Invalid Email/Password" });
        }
      } catch (err) {
        reject({ status: 500, err });
      }
    });
  });
};

const logoutUser = (token) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "INSERT INTO blacklist_token (token) VALUES (?)";

    db.query(sqlQuery, [token], (err, result) => {
      if (err) return reject({ status: 500, err });
      resolve({ status: 200, result });
    });
  });
};

const forgotPassword = (body) => {
  return new Promise((resolve, reject) => {
    const { email } = body;
    const sqlQuery = `SELECT * FROM user WHERE email = ?`;

    db.query(sqlQuery, [email], (err, result) => {
      if (err) return reject({ status: 500, err });
      if (result.length == 0)
        return reject({ status: 401, err: "Email is invalid" });
      // console.log("result", result);
      const name = result[0].name;
      const otp = Math.ceil(Math.random() * 1000000);
      // console.log("OTP ", otp);
      sendForgotPass(email, { name: name, otp });
      const sqlQuery = `UPDATE user SET otp = ? WHERE email = ?`;

      db.query(sqlQuery, [otp, email], (err) => {
        if (err) return reject({ status: 500, err });
        const data = {
          email: email,
          name: name,
        };
        resolve({ status: 200, result: data });
      });
    });
  });
};

const checkOTP = (body) => {
  return new Promise((resolve, reject) => {
    const { email, otp } = body;
    const sqlQuery = `SELECT email, otp FROM user WHERE email = ? AND otp = ?`;

    db.query(sqlQuery, [email, otp], (err, result) => {
      if (err) return reject({ status: 500, err });
      if (result.length === 0)
        return reject({ status: 401, err: "Invalid OTP" });
      const data = {
        email: email,
      };
      resolve({ status: 200, result: data });
    });
  });
};

const resetPassword = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password, otp } = body;
    const sqlQuery = `SELECT * FROM user WHERE email = ? AND otp = ?`;

    db.query(sqlQuery, [email, otp], (err) => {
      if (err) return reject({ status: 500, err });

      const sqlUpdatePass = `UPDATE user SET password = ? WHERE email = ? AND otp = ?`;
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          db.query(sqlUpdatePass, [hashedPassword, email, otp], (err) => {
            if (err) return reject({ status: 500, err });

            const sqlUpdateOTP = `UPDATE user SET otp = null WHERE email = ?`;
            db.query(sqlUpdateOTP, [email], (err, result) => {
              if (err) return reject({ status: 500, err });
              resolve({ status: 201, result });
            });
          });
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  });
};

module.exports = {
  createNewUser,
  loginUser,
  logoutUser,
  forgotPassword,
  checkOTP,
  resetPassword,
};
