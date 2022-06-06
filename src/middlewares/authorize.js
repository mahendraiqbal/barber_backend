const jwt = require("jsonwebtoken");
const db = require("../config/db");

const checkToken = (req, res, next) => {
  const token = req.header("x-access-token");
  // console.log("[DEBUG] TOKEN", token);
  // next;
  const jwtOptions = {
    issuer: process.env.ISSUER,
  };
  const sqlQuery = `SELECT token FROM blacklist_token WHERE token = ?`;
  db.query(sqlQuery, [token], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length !== 0)
      return res
        .status(403)
        .json({ msg: "You need to login to perform this action" });
  });
  jwt.verify(token, process.env.SECRET_KEY, jwtOptions, (err, payload) => {
    if (err)
      return res.status(403).json({
        err,
      });
    const { id, name, email, roles_id } = payload;
    req.userInfo = { id, name, email, roles_id };
    next();
  });
};

const roleCustomer = (req, res, next) => {
  const { roles_id } = req.userInfo;
  console.log("req", req.userInfo);
  console.log("roles", roles_id);
  if (roles_id === 1) {
    console.log(roles_id);
    return next();
  }
  res.status(403).json({ err: "You're not a Customer" });
};

const roleAdmin = (req, res, next) => {
  const { roles_id } = req.userInfo;
  if (roles_id === 2) {
    return next();
  }
  res.status(403).json({ err: "You're not a Admin" });
};

const roleOwner = (req, res, next) => {
  const { roles_id } = req.userInfo;
  console.log("req", req.userInfo);
  console.log("roles", roles_id);
  if (roles_id === 3) {
    console.log(roles_id);
    return next();
  }
  res.status(403).json({ err: "You're not a Owner" });
};

module.exports = { checkToken, roleCustomer, roleAdmin, roleOwner };
