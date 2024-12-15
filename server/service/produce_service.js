const mysql = require("../database/mapper.js");

/*--------------계획서-------------*/

// 전체조회
const findAllPlan = async ()=>{
  let list = await mysql.query('planList');
  return list;
}

// 단건조회
const findPlanNo = async (no)=>{
  let list = await mysql.query('planInfo', no);
  let info = list[0];
  return info;
}

// 제품조회
const findAllPlanDtl = async (no)=>{
  let list = await mysql.query('planDtlList', no);
  return list;
}

/*--------------지시서-------------*/
// 조회
const findAllInst = async ()=>{
  let list = await mysql.query('instList');
  return list;
}

// 단건조회
const findInstNo = async (no)=>{
  let list = await mysql.query('instInfo', no);
  let info = list[0];
  return info;
}

// 등록
const instInsert = async (instInfo)=>{
  let result = await mysql.query('instInsert', instInfo);
  if( result.insertId > 0){
    return { inst_cd : result.insertId }; 
  }else{
    return {};
  }
}

module.exports = {
  findAllPlan,
  findPlanNo,
  findAllPlanDtl,
  findAllInst,
  findInstNo,
  instInsert,  
};
