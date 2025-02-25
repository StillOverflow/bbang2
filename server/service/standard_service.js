const mariadb = require("../database/mapper.js");

//-----------------BOM-------------------
//제품전체조회
const findAllPrd = async () => {
  let list = await mariadb.query("prdList");
  return list;
};
//제품 키워드 검색
const searchPrd = async (search) => {
  let list = await mariadb.query("prdSearch", [`%${search}%`]);
  return list;
};
//자재전체조회
const findAllMat = async () => {
  let list = await mariadb.query("matList");
  return list;
};
//자재 키워드 검색
const searchMtl = async (search) => {
  let list = await mariadb.query("matSearch", [`%${search}%`]);
  return list;
};
//BOM조회
const findBomByPc = async (prd_cd) => {
  let list = await mariadb.query("bomlist", prd_cd);
  return list;
};
//BOM등록
const createBom = async (bomInfo) => {

  let result = await mariadb.query("bomInsert", bomInfo);
  if (result.affectedRows > 0) {
    return { result: "success" };
  } else {
    return { result: "fail" };
  }
};
//BOM삭제
const deleteBom = async (prd_cd, mat_cd) => {
  let result = await mariadb.query("bomDel", [prd_cd, mat_cd]);
  if (result.affectedRows > 0) {
    return { result: "success", prd_cd: prd_cd, mat_cd: mat_cd };
  } else {
    return { result: "fail" };
  }
};
//bom자재사용량 업데이트
const updateBomUsage = async(updateInfo)=>{
  let resultArr = [];
  for (const obj of updateInfo) {
    let datas = [obj.usage, obj.mat_cd, obj.prd_cd];
    let result = await mariadb.query("updateBom", datas);
    
    if (result.affectedRows > 0) {
        resultArr.push("success");
    } else {
        resultArr.push("fail");
    }
  }
  if(resultArr.includes('fail')){    
    return 'fail';
  }else{
    return 'success';
  } 
}

//-----------------공정흐름도-------------------
//제품목록 조회(사용여부 포함)
const searchPrdUsage = async () => {
  let list = await mariadb.query("selectPrd");
  return list;
};

// 공정 흐름도 조회
const searchFlow = async (prd_cd) => {
  let list = await mariadb.query("procFlowByProd", prd_cd);
  return list;
};

//공정별 자재 조회
const searchProMtl = async (proc_cd) => {
  let list = await mariadb.query("selectMatByProc", proc_cd);
  return list;
};
//제품별 자재조회
const sarchProMtlByPrd = async (prdCd)=>{
  let list = await mariadb.query("selectAllMatByProc", prdCd);
  return list;
}
//공정 코드 조회
const searchProcCd = async () => {
  let list = await mariadb.query("selectProcCd");
  return list;
};

// 공정흐름도 삭제
const deleteProcessFlow = async (proc_flow_cd, prd_cd) => {
  let result = await mariadb.query("deleteProcessFlow", proc_flow_cd); //info 객체형태 전달
  if (result.affectedRows > 0) {
    //순서 업데이트

      deleteProMtl(proc_flow_cd),
      updateProSeq(prd_cd)

    return { result: true };
  } else {
    return { result: false };
  }
};

//자재삭제
const deleteProMtl = async(proc_flow_cd)=>{
  let result = await mariadb.query('deleteProcFlowMtl', proc_flow_cd);
  return result;
};

// 다중 공정 흐름도 + 자재 추가
const insertMultipleProcMat = async (values) => {
  let result = await mariadb.transOpen(async () => {
    for (const item of values) {
      const seqResult = await mariadb.transQuery("procFlowSeq");
      const procFlowCode = seqResult[0].seq;

      item.procFlow["PROC_FLOW_CD"] = procFlowCode; // 자동 생성된 공정 흐름 코드
      const flowRes = await mariadb.transQuery("insertProcFlow", item.procFlow);

      if (flowRes.affectedRows <= 0) {
        await mariadb.rollback();
        return { result: "fail", message: "공정 흐름 추가 실패" };
      }

      const materials = item.materials.map((material) => {
        material["PROC_FLOW_CD"] = procFlowCode; // 자동 생성된 코드로 매핑
        return material;
      });

      if (materials.length > 0) {
        for (const material of materials) {
          const matSeqResult = await mariadb.transQuery("procMtlSeq");
          material["PROC_MAT_FLOW_CD"] = matSeqResult[0].seq;

          const matRes = await mariadb.transQuery("insertProcessMtlFlow", material);

          if (matRes.affectedRows <= 0) {
            await mariadb.rollback();
            return { result: "fail", message: "자재 추가 실패" };
          }
        }
      }
      const prdCd = item.procFlow.prd_cd; // prd_cd 추출
      await updateProSeqBYtrans(prdCd, mariadb.transQuery);
    }

    await mariadb.commit();
    return { result: "success" };
  });

  return result;
};
const updateProSeqBYtrans = async (prdCd, transQuery) => {
  const result = await mariadb.transQuery("procFlowByProd", [prdCd]); // 트랜잭션 내에서 실행
  let seq = 1;

  for (const obj of result) {
    await mariadb.transQuery("updateProSeq", [seq, obj.proc_flow_cd]); // 순서 업데이트
    seq++;
  }
};

//공정흐름도만 추가

const insertProcFlow = async (procFlows) => {
  return await mariadb.transOpen(async () => {
    for (const procFlow of procFlows) {
      // 공정흐름 코드 시퀀스 생성
      const seqResult = await mariadb.transQuery("procFlowSeq");
      const procFlowCode = seqResult[0].seq;
      procFlow["PROC_FLOW_CD"] = procFlowCode;

      // 공정흐름 등록
      const result = await mariadb.transQuery("insertProcFlow", procFlow);

      if (result.affectedRows <= 0) {
        await mariadb.rollback();
        return { result: "fail", message: "공정 흐름 추가 실패" };
      }

      // prd_cd 추출 및 업데이트
      const prdCd = procFlow.prd_cd;
      await updateProSeqBYtrans(prdCd, mariadb.transQuery);
    }

    await mariadb.commit();
    return { result: "success" };
  });
};
// 공정별 자재만 추가
const insertProcessMaterial = async (materials) => {
  return await mariadb.transOpen(async () => {
    for (const material of materials) {
      // 공정별 자재 코드 시퀀스 생성
      const seqResult = await mariadb.transQuery("procMtlSeq");
      const procMatFlowCode = seqResult[0].seq;
      material["PROC_MAT_FLOW_CD"] = procMatFlowCode;

      // 자재 등록
      const result = await mariadb.transQuery("insertProcessMtlFlow", material);

      if (result.affectedRows <= 0) {
        await mariadb.rollback();
        return { result: "fail", message: "자재 등록 실패" };
      }
    }

    await mariadb.commit();
    return { result: "success" };
  });
};
//흐름도추가+ 기존자재추가
const insertProcFlowStnMaterials = async (values) => {
  return await mariadb.transOpen(async () => {
    for (const item of values) {
      let procFlowCode;

      // 새로운 공정 흐름도 추가
      if (item.procFlow) {
        const seqResult = await mariadb.transQuery("procFlowSeq");
        procFlowCode = seqResult[0].seq;

        item.procFlow["PROC_FLOW_CD"] = procFlowCode; // 자동 생성된 공정 흐름 코드
        const flowRes = await mariadb.transQuery("insertProcFlow", item.procFlow);

        if (flowRes.affectedRows <= 0) {
          await mariadb.rollback();
          return { result: "fail", message: "새 공정 흐름도 추가 실패" };
        }
      }

      // 기존 공정 흐름도에 자재 추가
      if (item.existingFlowMaterials?.length > 0) {
        for (const material of item.existingFlowMaterials) {
          const matSeqResult = await mariadb.transQuery("procMtlSeq");
          material["PROC_MAT_FLOW_CD"] = matSeqResult[0].seq;

          const matRes = await mariadb.transQuery("insertProcessMtlFlow", material);

          if (matRes.affectedRows <= 0) {
            await mariadb.rollback();
            return { result: "fail", message: "기존 공정 흐름도 자재 추가 실패" };
          }
        }
      }
       // 공정 순서 업데이트
       const prdCd = item.procFlow.prd_cd;
       await updateProSeqBYtrans(prdCd, mariadb.transQuery);
    }

    await mariadb.commit();
    return { result: "success" };
  });
};

//공정별 자재 삭제
const deleteProcessMtlFlow = async (proc_mtl_flow_cd) => {
  let result = await mariadb.query("deleteProcessMtlFlow", proc_mtl_flow_cd); //info 객체형태 전달
  if (result.affectedRows > 0) {
    return { result: "success" };
  } else {
    return { result: "fail" };
  }
};
//순서 불러오기
const getMaxProcSeq = async (prdCd) => {
  const result = await mariadb.query("ProcessSeq", prdCd);
  return result;
};
//순서업데이트(삭제하면 실시간으로 순서업데이트)
const updateProSeq = async(prdCd)=>{
  let result = await mariadb.query('procFlowByProd',prdCd);
  let seq=1;

  for(obj of result){
    await mariadb.query('updateProSeq', [seq, obj.proc_flow_cd]);
    seq++;
  }
};


//순서그리드 실험용

const updateProcSeq = async (procFlowCd, procSeq) => {
  await mariadb.query("updateProSeq", [procSeq, procFlowCd]);
};

//개수체크
const procMatUsage = async(matCd, prdCd)=>{
  let result = await mariadb.query("selectProcMtlsUsage", [matCd, prdCd]);
  return result;
}

//자재사용량 업데이트
const updateMatUsage = async(updateInfo)=>{
  let resultArr = [];
  for (const obj of updateInfo) {
    let datas = [obj.mat_qty, obj.proc_mat_flow_cd];
    let result = await mariadb.query("updateProcMtl", datas);
    
    if (result.affectedRows > 0) {
        resultArr.push("success");
    } else {
        resultArr.push("fail");
    }
  }
  if(resultArr.includes('fail')){    
    return 'fail';
  }else{
    return 'success';
  } 
}
//-----------------------------자재관리----------------------------------
const bringMaterial = async()=>{
  let result = await mariadb.query("bringMat");
  return result;
};


//자재등록
const insertMaterial = async(matInfo)=>{
  let new_mat_cd = (await mariadb.query('getMatCd'))[0].mat_cd
  matInfo.mat_cd = new_mat_cd;

  let result = await mariadb.query('matInsert', matInfo);
  if( result.affectedRows  > 0){
    return { result: true, mat_cd : new_mat_cd }; 
  }else{
    return {};
  }
};

//자재수정
const updateMaterial = async(matCd,updateInfo)=>{
  let datas = [updateInfo, matCd];
  let result = await mariadb.query('matUpdate', datas);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
}

//자재삭제
const deleteMaterial = async(matCd)=>{
  let result = await mariadb.query('matDelete', matCd);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
}

//------------------------------제품관리--------------------------------
//제품등록
const insertProduct = async(prdInfo)=>{
  let new_prd_cd = (await mariadb.query('getPrdCd'))[0].prd_cd
  prdInfo.prd_cd = new_prd_cd;

  let result = await mariadb.query('prdInsert', prdInfo);
  if(result.affectedRows >0){
    return {result: true};
  }else{
    return {};
  }
};

//제품수정
const updateProduct = async(prdCd, updateInfo)=>{
  let datas = [updateInfo, prdCd];
  let result = await mariadb.query('prdUpdate', datas);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
};

//제품삭제
const deleteProduct = async(prdCd)=>{
  let result = await mariadb.query('prdDelete', prdCd);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
}

//------------------------------------공정관리---------------------------------
//공정조회
const processSelect = async(datas)=>{
  let result = await mariadb.query('processSelect', datas);
  return result;
}

//공정등록
const insertProcess = async (procInfo, prefix) => {
  // prefix 전달하여 새로운 코드 생성
  prefix = prefix.toUpperCase();

  let new_proc_cd = (await mariadb.query('getProcCd', prefix))[0].proc_cd;
  procInfo.proc_cd = new_proc_cd;

  let result = await mariadb.query('procInsert', procInfo);
  if (result.affectedRows > 0) {
    return { result: true};
  } else {
    return {};
  }
};
//공정수정
const updateProcess = async(procCd, updateInfo)=>{
  let datas = [updateInfo, procCd];
  let result = await mariadb.query('procUpdate', datas);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
};

//공정삭제
const deleteProcess = async(procCd)=>{
  let result = await mariadb.query('procDelete', procCd);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
};

//-------------------------------------거래처관리------------------------------------------------
//거래처등록
const insertAccount = async(actInfo)=>{
  let new_act_cd = (await mariadb.query('getActCd'))[0].act_cd
  actInfo.act_cd = new_act_cd;

  let result = await mariadb.query('actInsert', actInfo);
  if(result.affectedRows >0){
    return {result: true, act_cd:new_act_cd};
  }else{
    return {};
  }
};

//거래처수정
const updateAccount = async(actCd, updateInfo)=>{
  let datas = [updateInfo, actCd];
  let result = await mariadb.query('actUpdate', datas);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
};

//거래처삭제
const deleteAccount = async(actCd)=>{
  let result = await mariadb.query('actDelete', actCd);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
};

//-------------------------------------불량관리------------------------------------------------
//불량코드조회
const defectSelect = async(datas)=>{
  let result = await mariadb.query('defectSelect', datas);
  return result;
}

//불량등록
const insertDefect = async(defInfo)=>{
  let new_def_cd = (await mariadb.query('getDefCd'))[0].def_cd
  defInfo.def_cd = new_def_cd;

  let result = await mariadb.query('defInsert', defInfo);
  if(result.affectedRows >0){
    return {result: true, def_cd:new_def_cd};
  }else{
    return {};
  }
};

//불량수정
const updateDefect = async(defCd, updateInfo)=>{
  let datas = [updateInfo, defCd];
  let result = await mariadb.query('defUpdate', datas);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
};

//불량삭제
const deleteDefect = async(defCd)=>{
  let result = await mariadb.query('defDelete', defCd);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
};

//-------------------------------------사원관리------------------------------------------------
//비밀번호 자동생성
// const generatePassword = () => {
//   return Math.random().toString(36).slice(2); // 6자리 난수 생성
// };

//사원등록
const insertMember = async(memInfo)=>{
  
  //코드생성
  let new_mem_cd = (await mariadb.query('getMemCd'))[0].mem_cd;
  memInfo.mem_cd = new_mem_cd;
  
  //아이디생성
  let new_id = (await mariadb.query('getMemId'))[0].id
  memInfo.id = new_id;

  //비밀번호생성
  memInfo.password = memInfo.birth.replace(/-/g,"");

  let result = await mariadb.query('memInsert', memInfo);
  if(result.affectedRows >0){
    return {result: true};
  }else{
    return {result: false};
  }
};

//사원수정
const updateMember = async(memCd, updateInfo)=>{
  let datas = [updateInfo, memCd];
  let result = await mariadb.query('memUpdate', datas);
  if (result.affectedRows > 0) {
    return { result: true };
  } else {
    return { result: false };
  }
};

//부서
const selectDept = async()=>{
  let list = await mariadb.query('depSelect');
  return list;
}
module.exports = {
  //BOM
  findAllPrd,
  searchPrd,
  findAllMat,
  searchMtl,
  findBomByPc,
  createBom,
  deleteBom,
  updateBomUsage,
  
  //공정흐름도
  searchPrdUsage,
  searchFlow,
  searchProMtl,
  searchProcCd,
  deleteProcessFlow,
  //insertProcMat,
  insertProcFlow,
  insertProcessMaterial,
  deleteProcessMtlFlow,
  getMaxProcSeq,
  updateProSeq,
  updateProcSeq,
  sarchProMtlByPrd,
  insertMultipleProcMat,
  insertProcFlowStnMaterials,
  //자재관리
  bringMaterial,
  insertMaterial,
  updateMaterial,
  deleteMaterial,
  
  //제품관리
  insertProduct,
  updateProduct,
  deleteProduct,
  processSelect,

  //공정관리
  insertProcess,
  updateProcess,
  deleteProcess,

  //거래처관리
  insertAccount,
  updateAccount,
  deleteAccount,

  //불량코드관리
  defectSelect,
  insertDefect,
  updateDefect,
  deleteDefect,

  //사원관리
  insertMember,
  updateMember,
  selectDept,


  procMatUsage,
  updateMatUsage,
  deleteProMtl,
  updateProSeqBYtrans
};
