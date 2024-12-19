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

/*
PROD_PLAN_CD: this.plan_cd, 
WORK_DT: this.work_dt,
PRD_CD: this.prd_cd,
PROC_FLOW_CD : val[i].data.PROC_FLOW_CD,
PROC_SEQ : i+1,
*/
const stdInsert = async (values) => { 

  let result = await mariadb.transOpen( async () => {

        // 헤더 시퀀스 nextval 얻기
        let seq_res = await mariadb.transQuery('stdSeq');
        let mySeq = seq_res[0].seq;
        
        // 헤더 삽입
        let header = values[0]; // 공통되는 부분은 헤더값으로 빼기
        let arr = [
            mySeq,
            header.PROD_PLAN_CD,
            header.WORK_DT
        ];
        let header_res = await mariadb.transQuery('instInsert', arr);

        // 디테일 삽입
        values.forEach((val) => { // 헤더 시퀀스값 추가
            val.INST_CD = mySeq;
        });
        let dtl_res = await mariadb.transQuery('stdDtlInsert', values);
        
        if(header_res.affectedRows > 0 & dtl_res.affectedRows > 0){ // 모두 성공했는지 판단
            await mariadb.commit();
            return 'success';
        }
        else return 'fail';

    });
    
    return result;

}; 

module.exports = {
  findAllPlan,
  findPlanNo,
  findAllPlanDtl,
  findAllInst,
  findInstNo,
  instInsert,  
  findInstFlow,
  findInstMatFlow,
  stdInsert
};
