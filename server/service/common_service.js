const mariadb = require('../database/mapper.js');

//! QQQ01 중 'QQQ'와 관련된 공통코드를 모두 찾을 때
const findCommList = async (cd) => {
  let result = await mariadb.query('findCommList', cd);  
  return result;
};

//! 사원 조회 (매개변수 없으면 전체 조회, 있으면 부서별 직원 조회)
const findMemList = async (data) => {
  let result = await mariadb.query('memList', data);  
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

//! 주문서 제품조회
const findOrderNo = async (no)=>{
  let list = await mariadb.query('commOrderDtlList', no);
  return list;
}

//! 로그인
const login = async (datas)=>{
  let list = await mariadb.query('login', datas);
  let info = list[0];
  return info;
}


/* ---------------대시보드 -------------- */
// 상단 갯수
const dashBoardTop = async (values) => {
  let dateArr = values.TODAY.split("-");
  let date = {
    "year" : dateArr[0],
    "month" : dateArr[1],
    "day" : dateArr[2]
  }
  let result = await mariadb.query('dashBoardTop', date);  
  return result;
};

// 부서별 사원 수
const dashBoardDpt = async () => {
  let result = await mariadb.query('dashBoardDpt');  
  return result;
};

// 월간 생산량
const dashBoardStats = async (values) => {
  let dateArr = values.TODAY.split("-");
  let result = await mariadb.query('dashBoardStats', dateArr[0]);  
  return result;
};

module.exports = {
    findCommList,
    findMemList,
    accountSelect,
    materialSelect,
    productSelect,
    findOrderNo,
    login,

    dashBoardTop,
    dashBoardDpt,
    dashBoardStats
};