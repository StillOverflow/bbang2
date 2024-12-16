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
    let executeSql = sqlList[alias];
    connectionPool.query(executeSql, values, (err, results) => {
      if (err) {
        reject({ err });
      } else {
        resolve(results);
      }
    });
  }).catch(err => console.log(err));
};

module.exports = {
  query,
};
