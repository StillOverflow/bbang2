const mariadb = require('../database/mapper.js');

// QQQ01 중 'QQQ'와 관련된 공통코드를 모두 찾을 때
const findCommList = async (cd) => {
  let result = await mariadb.query('findCommList', cd);  
  return result;
};

//! 거래처 조회 => { act_type : 'E01' } 형태로 넘어감
const accountSelect = async (datas) => {
  let result = await mariadb.query('accountSelect', datas);  
  return result;
};

//! 자재 조회 => 객체{ } 형태로 넘어감
const materialSelect = async (datas) => {
  let result = await mariadb.query('materialSelect', datas);  
  return result;
};

//! 상품 조회 => 객체{ } 형태로 넘어감{}
const productSelect = async (datas) => {
  let result = await mariadb.query('productSelect', datas);  
  return result;
};

module.exports = {
    findCommList,
    accountSelect,
    materialSelect,
    productSelect
};