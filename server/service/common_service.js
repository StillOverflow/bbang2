const mariadb = require('../database/mapper.js');

// 정확히 특정 공통코드를 찾을 때
const findComm = async (cd) => {
  let result = await mariadb.query('findComm', cd);  
  return result[0];
};

// QQQ01 중 'QQQ'와 관련된 공통코드를 모두 찾을 때
const findCommList = async (cd) => {
    let result = await mariadb.query('findCommList', cd);  
    return result;
  };

module.exports = {
    findComm,
    findCommList
}