// const mysql = require('mysql');
const mariadb = require("mariadb/callback");
const sqlList = require("./sql.js");

// 단일 작업 시
// createPool (자동 커밋)
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

  logger: {
    query: (msg) => console.log(msg),
    error: (err) => console.log(err),
  }
});

// 자동 커밋 쿼리 메소드
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
  })
  .catch(err => console.log(err));

};


// 다중 작업 시
// createConnection (다중 작업에서 트랜잭션 제어 가능)
const connection = mariadb.createConnection({
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

  logger: {
    query: (msg) => console.log(msg),
    error: (err) => console.log(err),
  }
});

// 트랜잭션 오픈
const transOpen = async (callback) => { // 콜백함수 형식으로 서비스에서 호출 후 내부에서 작업
  await connection.beginTransaction(async () => {
    console.log('TRANSACTION OPEN!!');
    await callback();
  });
};

// 개별 쿼리 함수 (트랜잭션 안에서 실행)
const transQuery = (alias, values) => { 
  return new Promise((resolve, reject) => {
    let selected = sqlList[alias];

    // 동적인 쿼리(sqls/...js 파일에서 해당 내용이 함수 형태일 때) 추가작업
    let executeSql = typeof selected == 'string' ? selected : selected(values);
    console.log(executeSql);

    connection.query(executeSql, values, (err, results) => {
      if (err) {
        reject({ err });
      } else {
        resolve(results);
      }
    });
  });
};

// 수동 커밋
const commit = () => {
  connection.commit((err) => { 
    if(err){ // 오류 시 전체 롤백
      connection.rollback(() => { throw err; });
    }
    console.log('COMMIT!!');
  });
};


module.exports = {
  query,
  transOpen,
  transQuery,
  commit
};