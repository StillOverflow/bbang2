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

//계획서 등록
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

//계획서 수정
const planUpdate = async (no, values) => { 
  let result = await mariadb.transOpen( async () => {

    // 헤더 수정
    let header_res = await mariadb.transQuery('planUpdate', [values[0], no]);
    
    // 디테일 삽입
    values[1].forEach((val) => { // 헤더 시퀀스값 추가
        val["PROD_PLAN_CD"] = no;
    });
    let dtl_del = await mariadb.transQuery('planDtlDelete', no);
    let dtl_res = await mariadb.transQuery('planDtlInsert', values[1]);
    
    if(header_res.affectedRows > 0 && dtl_del.affectedRows > 0 && dtl_res.affectedRows > 0){ // 모두 성공했는지 판단
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
const findAllInst = async (searchs)=>{
  let list = await mariadb.query('instList', searchs);
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

      // insert하기 전 전체 삭제
      await mariadb.query('instDelete', values);

      // 헤더 시퀀스 nextval 얻기
      let seq_res = await mariadb.transQuery('instSeq');      
      let mySeq = seq_res[0].seq;
              
      // 헤더 삽입
      values[0]["inst_cd"] = mySeq;            

      let header_res = await mariadb.transQuery('instInsert', values[0]);
      
      // 디테일 삽입
      values[1].forEach((val) => { // 헤더 시퀀스값 추가
          val["inst_cd"] = mySeq;
      });      
        
      let dtl_res = await mariadb.transQuery('instDtlInsert', values[1]);     
      
      
      // 공정흐름 삽입
      values[2].forEach((val) => { // 헤더 시퀀스값 추가
        val["inst_cd"] = mySeq;
      });
      
      let flow_res = await mariadb.transQuery('instFlowInsert', values[2]);
      
      // 공정별 자재 삽입
      let i = 0;
      for (const obj of values[2]){   
        let mat_res =  await mariadb.transQuery('instMatInsert', [obj.inst_cd, obj.PROC_FLOW_CD]);

        if(mat_res.affectedRows > 0){                                       
          i++;
        }
      }

      await mariadb.transQuery('planUpdate', [{STATUS:'Z02'}, values]); //계획서 상태 수정
      
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


  /* ------------------------생산공정------------------------- */

//지시서 단건조회
const findResultNo = async (searchs)=>{
  let list = await mariadb.query('resultInfo', searchs);
  return list;
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
  let resultArr = [];

  let datas = [updateInfo[0], no];
  
  let list = await mariadb.query('processStart', datas);

  /* 자재 lot별 출고등록[S] */
  for (const obj of updateInfo[1]){  //사용 자재 목록

    let use_qty = parseInt(obj.MAT_USE_QTY); //실사용량
    let lotInserArr = []; //lot 배열 초기화
    let mat_qty = 0; //lot별 사용량 임시저장

    while (mat_qty < use_qty) { //lot별 사용량이 실사용량과 같아질때까지

      let mat_stock = 0;
      let rest_qty = use_qty - mat_qty; //잔여량
      let list = await mariadb.transQuery('matLotSearch', obj.MAT_CD); //자재 lot SELECT

      if(rest_qty <= mat_stock) mat_stock = parseInt(list[0]["MAT_STOCK"]); //자재 재고가 잔여량보다 같거나 적으면 전 수량 다가져옴
      else mat_stock = rest_qty; //자재 재고가 잔여량보다 많으면 잔여량만큼 가져옴
      
      mat_qty += mat_stock; //잔여량에 가져온 재고량 더함

      lotInserArr.push({ //insert할 lot정보 배열에 저장
        "MAT_OUT_QTY" : mat_stock,
        "MAT_LOT_CD" : list[0]["MAT_LOT_CD"],
        "MAT_CD" : obj.MAT_CD,
        "PROD_RESULT_CD" : obj.PROD_RESULT_CD,
      });     

      let lot_is = await mariadb.query('matLotInsert', lotInserArr); //자재출고 테이블에 insert
      let lot_ud = await mariadb.query('matLotUpdate', [mat_stock, list[0]["MAT_LOT_CD"]]); //자재 수량 변경

      if(lot_is.affectedRows > 0 && lot_ud.affectedRows > 0){
        resultArr.push('success');
        
      }else{
        resultArr.push('fail');
        
      }
    }

    /* 자재 lot별 출고등록[E] */    
  }

  if(!resultArr.includes('fail') && list.affectedRows > 0){        
    await mariadb.commit();
    return 'success';
  }else{    
    await mariadb.rollback();
    return 'fail';
  }  

}; 

 //공정시작 시 계획서/지시서 상태변경
 const statusChange = async (no, datas) => { 

  let obj = {
    STATUS : datas.STATUS,
    no : no
  }
  
  let result = await mariadb.query('statusChage', obj);

  if(result.affectedRows > 0){        
    await mariadb.commit();
    return 'success';
  }else{    
    await mariadb.rollback();
    return 'fail';
  }  
 }

const progressEnd = async (no, updateInfo)=>{ 
  let result = await mariadb.transQuery('processStart', [updateInfo, no]); //자재 lot SELECT

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
  planUpdate,
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
  progressStart,
  progressEnd,
  findResultNo,
  statusChange
};
