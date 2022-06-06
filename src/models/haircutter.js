const db = require("../config/db");
const mysql = require("mysql");

const paginatedHaircutter = (query, keyword) => {
  return new Promise((resolve, reject) => {
    let sqlQuery = `SELECT * FROM haircutter`;
    const statement = [];
    let data = "";
    let page = parseInt(query.page);
    let limit = parseInt(query.limit);
    let offset = "";

    // logika buat where

    let type = "";
    if (query.type && query.type.toLowerCase() == "normal") type = "normal";
    if (query.type && query.type.toLowerCase() == "regular") type = "regular";
    if (query.type && query.type.toLowerCase() == "high") type = "high";
    // if (type) {
    //     sqlQuery += " WHERE type = ?";
    //     statement.push(type);
    // }

    if (type) {
      sqlQuery += ` WHERE type = ?`;
      statement.push(type, city);
      data += `&type=${type}&city=${city}`;
    } else if (type) {
      sqlQuery += ` WHERE type = ?`;
      statement.push(type);
      data += `&type=${type}`;
    }

    if (keyword) {
      sqlQuery += ` AND name LIKE ?`;
      statement.push(keyword);
      data += `&name=${query.name}`;
    }

    const order = query.order;
    let orderBy = "";
    if (query.by && query.by.toLowerCase() == "price") orderBy = "price";
    if (query.by && query.by.toLowerCase() == "type") orderBy = "type";
    if (order && orderBy) {
      sqlQuery += " ORDER BY ? ?";
      statement.push(mysql.raw(orderBy), mysql.raw(order));
    }

    const countQuery = `SELECT COUNT(*) AS "count" from haircutter`;
    db.query(countQuery, (err, result) => {
      if (err)
        return reject({
          status: 500,
          err,
        });

      // const page = parseInt(query.page);
      // const limit = parseInt(query.limit);
      const count = result[0].count;

      if (!query.page && !query.limit) {
        page = 1;
        limit = 1000;
        offset = 0;
        sqlQuery += " LIMIT ? OFFSET ?";
        statement.push(limit, offset);
      } else {
        sqlQuery += " LIMIT ? OFFSET ?";
        offset = (page - 1) * limit;
        statement.push(limit, offset);
      }

      const meta = {
        count,
        next:
          page == Math.ceil(count / limit)
            ? null
            : `/haircutter?page=${page + 1}&limit=${limit}` + data,
        page:
          page == 1
            ? null
            : `/haircutter?page=${page - 1}&limit=${limit}` + data,
      };
      db.query(sqlQuery, statement, (err, result) => {
        if (err)
          return reject({
            status: 500,
            err,
          });
        resolve({
          status: 200,
          result: {
            data: result,
            meta,
          },
        });
      });
    });
  });
};

module.exports = {
  paginatedHaircutter,
};
