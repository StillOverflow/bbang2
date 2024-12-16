// const mysql = require('mysql');
const mariadb = require("mariadb/callback");
const sqlList = require("./sql.js");

const connectionPool = mariadb.createPool({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PWD,
  database: process.env.DB,
  connectionLimit: process.env.LIMIT,

  trace: true, // log
  permitSetMultiParamEntries: true, // parameter가 객체일 경우 escape작업
  insertIdAsNumber: true, //insertId를 Number 타입으로 변환
  bigIntAsNumber: true, // bigInt 타입을 자동으로 Number 타입으로 변환
});

const query = (alias, values) => {
  return new Promise((resolve, reject) => {
    let selected = sqlList[alias];

    // 검색조건이 동적인 경우 한번 더 작업 필요(sql.js(sales.js)에서 쿼리를 가져올 때 함수형태이면)
    let executeSql = typeof selected == 'string' ? selected : selected(values);

    connectionPool.query(executeSql, values, (err, results) => {
      if (err) {
        reject({ err });
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  query,
};
