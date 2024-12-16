const mariadb = require('../database/mapper.js');

/*--------------설비-------------*/

// 상태전체조회
const findStatEq = async ()=>{
  let list = await mariadb.query('eqStatList');
  return list;
};

// 설비전체조회
const findAllEq = async ()=>{
  let list = await mariadb.query('eqAllList');
  return list;
};

// 등록
const insertEq = async (eqInfo)=>{
  let result = await mariadb.query('insertEq', eqInfo);
  if( result.insertId > 0){
    return { eqp_cd : result.insertId }; 
  }else{
    return {};
  }
};

module.exports = {
  findStatEq,
  findAllEq,
  insertEq
};