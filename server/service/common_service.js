const mariadb = require('../database/mapper.js');

// QQQ01 중 'QQQ'와 관련된 공통코드를 모두 찾을 때
const findCommList = async (cd) => {
  let result = await mariadb.query('findCommList', cd);  
  return result;
};

// 사원 조회 (매개변수 없으면 전체 조회, 있으면 부서별 직원 조회)
const findMemList = async (dpt_cd) => {
  let result = await mariadb.query('memList', dpt_cd);  
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

//주문서 제품조회
const findOrderNo = async (no)=>{
  let list = await mariadb.query('orderDtlList', no);
  return list;
}

//로그인
const login = async (datas)=>{
  let list = await mariadb.query('login', datas);
  
  if(list.length > 0){ //일치하는 정보가 있을 때
    if(list.STATUS == 'G03'){ //퇴사한 경우
      return 'quit';
    } else {

      return 'success';      
    }
  }else{ //일치하는 정보가 없을 때
    return 'fail';
  }
}

module.exports = {
    findCommList,
    findMemList,
    accountSelect,
    materialSelect,
    productSelect,
    findOrderNo,
    login
};