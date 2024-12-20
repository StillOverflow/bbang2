const mariadb = require("../database/mapper.js");

/*--------------계획서-------------*/

// 전체조회
const findAllPlan = async ()=>{
  let list = await mariadb.query('planList');
  return list;
}

// 단건조회
const findPlanNo = async (no)=>{
  let list = await mariadb.query('planSearch', no);
  return list;
}

// 제품조회
const findAllPlanDtl = async (no)=>{
  let list = await mariadb.query('planDtlList', no);
  return list;
}

// 계획서 삭제
const deletePlan = async (values)=>{
  console.log(values);
  let list = await mariadb.query('planDelete', values);
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

//지시서 등록
const stdInsert = async (values) => { 
  

  let result = await mariadb.transOpen( async () => {

      // 헤더 시퀀스 nextval 얻기
      let seq_res = await mariadb.transQuery('instSeq');
      let mySeq = seq_res[0].seq;
              
      // 헤더 삽입
      values[0]["INST_CD"] = mySeq;      

      let header_res = await mariadb.transQuery('instInsert', values[0]);
      
      // 디테일 삽입
      values[1].forEach((val) => { // 헤더 시퀀스값 추가
          val["INST_CD"] = mySeq;
      });
      let dtl_res = await mariadb.transQuery('instDtlInsert', values[1]);
      

      // 공정흐름 삽입
      values[2].forEach((val) => { // 헤더 시퀀스값 추가
        val["INST_CD"] = mySeq;
      });
      let flow_res = await mariadb.transQuery('instFlowInsert', values[2]);

      if(header_res.affectedRows > 0 && dtl_res.affectedRows > 0 && flow_res.affectedRows > 0){ // 모두 성공했는지 판단
        await mariadb.commit();
        return 'success';
      } else {
          await mariadb.rollback();
          return 'fail';
      }
    });
    return result;
}; 

module.exports = {
  findAllPlan,
  findPlanNo,
  findAllPlanDtl,
  findAllInst,
  deletePlan,

  findInstNo,
  instInsert,  
  findInstFlow,
  findInstMatFlow,
  stdInsert
};
