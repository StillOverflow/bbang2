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

// 주문서 제품조회
const findOrderNo = async (no)=>{
  let list = await mariadb.query('orderDtlList', no);
  return list;
}

// 제품 전체조회
const findAllProduct = async ()=>{
  let list = await mariadb.query('productList');
  return list;
}

module.exports = {
    findComm,
    findCommList,
    findOrderNo,
    findAllProduct
};