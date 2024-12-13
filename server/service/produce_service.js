const mariadb = require("../database/mapper.js");

/*--------------계획서-------------*/

// 전체조회
const findAllPlan = async ()=>{
  let list = await mariadb.query('planList');
  return list;
}

// 단건조회
const findPlanNo = async (no)=>{
  let list = await mariadb.query('planInfo', no);
  let info = list[0];
  return info;
}

// 제품조회
const findAllPlanDtl = async (no)=>{
  let list = await mariadb.query('planDtlList', no);
  return list;
}


/*--------------지시서-------------*/
// 조회
const findAllInst = async ()=>{
  let list = await mariadb.query('instList');
  return list;
}

// 단건조회
const findInstNo = async (no)=>{
  let list = await mariadb.query('instInfo', no);
  let info = list[0];
  return info;
}

// 등록
const instInsert = async (instInfo)=>{
  let result = await mariadb.query('instInsert', instInfo);
  if( result.insertId > 0){
    return { inst_cd : result.insertId }; 
  }else{
    return {};
  }
}

//제품별 공정 조회
const findInstFlow = async (no)=>{
  let list = await mariadb.query('instProcList', no);
  return list;
}

//제품 공정별 자재 조회
const findInstMatFlow = async (no)=>{
  let list = await mariadb.query('instProcMtList', no);
  return list;
}

const stdInsert = async (values) => { 

  let nextVal = await mariadb.query('inst_seq'); 
  let header_res = await mariadb.query('instInsert', [instInfo, nextVal]);  
  
  values.forEach((val) => {
    val.inst_cd = nextVal;
  });
  
  let dtl_res = await mariadb.query('instDtlInsert', values);
  if(header_res.affectedRows > 0 & dtl_res.affectedRows > 0){
      return {"result" : "success"};
  } else {
      return {"result" : "fail"};
  }

}; 

module.exports = {
  findAllPlan,
  findPlanNo,
  findAllPlanDtl,
  findAllInst,
  findInstNo,
  instInsert,  
  findInstFlow,
  findInstMatFlow
};
