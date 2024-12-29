const mariadb = require("../database/mapper.js");

/*--------------생산계획서-------------*/

//계획서 전체조회
const findAllPlan = async (searchs)=>{
  let list = await mariadb.query('planSelect', searchs);
  return list;
}

//계획서 단건조회
const findPlanNo = async (no)=>{
  let list = await mariadb.query('planSearch', no);
  return list;
}

//계획서 제품조회
const findAllPlanDtl = async (no)=>{
  let list = await mariadb.query('planDtlList', no);
  return list;
}

//계획서 계획서 삭제
const deletePlan = async (values)=>{
  let del_res = await mariadb.query('planDelete', values);

  if(del_res.affectedRows > 0){ // 모두 성공했는지 판단
    await mariadb.commit();
    return 'success';
  } else {
      await mariadb.rollback();
      return 'fail';
  }
}

//지시서 등록
const planInsert = async (values) => { 
  let result = await mariadb.transOpen( async () => {

      // 헤더 시퀀스 nextval 얻기
      let seq_res = await mariadb.transQuery('planSeq');
      let mySeq = seq_res[0].seq;
              
      // 헤더 삽입
      values[0]["PROD_PLAN_CD"] = mySeq;      

      let header_res = await mariadb.transQuery('planInsert', values[0]);
      
      // 디테일 삽입
      values[1].forEach((val) => { // 헤더 시퀀스값 추가
          val["PROD_PLAN_CD"] = mySeq;
      });
      let dtl_res = await mariadb.transQuery('planDtlInsert', values[1]);
      
      if(header_res.affectedRows > 0 && dtl_res.affectedRows > 0){ // 모두 성공했는지 판단
        await mariadb.commit();
        return 'success';
      } else {
          await mariadb.rollback();
          return 'fail';
      }
    });
    return result;
}; 


/*--------------생산지시서-------------*/
//지시서 조회
const findAllInst = async ()=>{
  let list = await mariadb.query('instList');
  return list;
}

//지시서 단건조회
const findInstNo = async (no)=>{
  let list = await mariadb.query('instInfo', no);
  let info = list[0];
  return info;
}

//지시서 제품목록 조회
const findInstDtlNo = async (no)=>{
  let list = await mariadb.query('instDtlList', no);
  return list;
}

//지시서 제품별 공정 조회
const findInstFlow = async (no)=>{
  let list = await mariadb.query('instProcList', no);
  return list;
}

//지시서 제품 공정별 자재 조회
const findInstMatFlow = async (no)=>{
  let list = await mariadb.query('instProcMtList', no);
  return list;
}

//지시서 등록
const instInsert = async (values) => { 
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

      // 공정별 자재 삽입
      let i = 0;
      for (const obj of values[2]){   
        let mat_res =  await mariadb.transQuery('instMatInsert', obj.PROC_FLOW_CD);
        if(mat_res.affectedRows > 0){                                       
          i++;
        }
      }

      if(header_res.affectedRows > 0 && dtl_res.affectedRows > 0 && flow_res.affectedRows > 0 && i > 0){ // 모두 성공했는지 판단
        await mariadb.commit();
        return 'success';
      } else {
          await mariadb.rollback();
          return 'fail';
      }
    });
    return result;
}; 

//지시서 삭제
const deleteInst = async (values)=>{
  let del_res = await mariadb.query('instDelete', values);

  if(del_res.affectedRows > 0){ // 모두 성공했는지 판단
    await mariadb.commit();
    return 'success';
  } else {
      await mariadb.rollback();
      return 'fail';
  }
}

//지시서에 커스텀된 제품별 공정 조회
const findInstCusFlow = async (values)=>{
  let list = await mariadb.query('instCusFlow', values);
  return list;
}

 //지시서 제품별 커스텀된 공정목록 조회 -> 설비목록
const findInstCusEqu = async (no)=>{
  let list = await mariadb.query('instCusEqu', no);
  return list;
}

//자재사용량 등록
const instMatUpdate = async (updateInfo) => { 

  let resultArr = [];
  for (const obj of updateInfo){   

    let datas = [obj["MAT_USE_QTY"], obj["INST_MAT_CD"]];
    let result = await mariadb.query('instMatUpdate', datas);

    if(result.affectedRows > 0){
      resultArr.push('success');
    }else{
      resultArr.push('fail');
    }
  }

  if(resultArr.includes('fail')){    
    return 'fail';
  }else{
    return 'success';
  }  
}; 

//공정 작업시작
const progressStart = async (no, updateInfo)=>{
  let datas = [updateInfo, no];
  let result = await mariadb.query('processStart', datas);
  
  if(result.affectedRows > 0){
    return 'success';
  }else{
    return 'fail';
  }
}; 


module.exports = {
  findAllPlan,
  findPlanNo,
  findAllPlanDtl,
  findAllInst,
  planInsert,
  deletePlan,

  findInstNo,
  instInsert,  
  findInstDtlNo,
  findInstFlow,
  findInstMatFlow,
  findInstCusFlow,
  findInstCusEqu,
  deleteInst,
  instMatUpdate,
  progressStart
};
