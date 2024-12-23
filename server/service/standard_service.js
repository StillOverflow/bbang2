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
  //console.log(bomInfo,' bomInfo');

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

//공정 코드 조회
const searchProcCd = async () => {
  let list = await mariadb.query("selectProcCd");
  return list;
};

// 공정흐름도 삭제
const deleteProcessFlow = async (proc_flow_cd) => {
  let result = await mariadb.query("deleteProcessFlow", proc_flow_cd); //info 객체형태 전달
  if (result.affectedRows > 0) {
    return { result: "success" };
  } else {
    return { result: "fail" };
  }
};

//공정흐름 등록 + 자재추가
const insertProcMat = async (values) => {
  let result = await mariadb.transOpen(async () => {
    // 1. 공정흐름코드가 없으면 시퀀스 새로 생성

    const seqResult = await mariadb.transQuery("procFlowSeq");
    let procFlowCode = seqResult[0].seq;
    values[0]["PROC_FLOW_CD"] = procFlowCode; // 새 공정흐름코드 추가
    // 공정흐름 추가
    let flowRes = await mariadb.transQuery("insertProcFlow", values[0]);
    if (flowRes.affectedRows <= 0) {
      await mariadb.rollback();
      return "fail";
    } else {
      await mariadb.commit();
    }

    // 2. 공정별 자재 추가
    let materials = values[1]; // 자재 리스트
    if (!Array.isArray(materials)) {
      materials = [materials];
    }
    if (materials.length > 0) {
      for (const material of materials) {
        const seqResult = await mariadb.transQuery("procMtlSeq");
        material["PROC_MAT_FLOW_CD"] = seqResult[0].seq;
        material["PROC_FLOW_CD"] = procFlowCode;

        const matRes = await mariadb.transQuery(
          "insertProcessMtlFlow",
          material
        );
        if (matRes.affectedRows <= 0) {
          await mariadb.rollback();
        }
      }
    } else {
      console.log("자재추가할게 없음");
    }

    // 3. 성공
    await mariadb.commit();
    return { result: "success" };
  });

  return result;
};

//공정흐름도만 추가
const insertProcFlow = async (procFlowData) => {
  return await mariadb.transOpen(async () => {
    // 공정흐름 코드 시퀀스 생성
    const seqResult = await mariadb.transQuery("procFlowSeq");
    const procFlowCode = seqResult[0].seq;
    procFlowData["PROC_FLOW_CD"] = procFlowCode;

    // 공정흐름 등록
    const result = await mariadb.transQuery("insertProcFlow", procFlowData);
    if (result.affectedRows <= 0) {
      await mariadb.rollback();
      return { result: "fail" };
    }

    await mariadb.commit();
    return { result: "success" };
  });
};
// 공정별 자재만 추가
const insertProcessMaterial = async (materialData) => {
  return await mariadb.transOpen(async () => {
    const seqResult = await mariadb.transQuery("procMtlSeq");
    const procMatFlowCode = seqResult[0].seq; // 공정별 자재 코드 시퀀스 생성
    materialData["PROC_MAT_FLOW_CD"] = procMatFlowCode;

    const result = await mariadb.transQuery(
      "insertProcessMtlFlow",
      materialData
    );
    if (result.affectedRows <= 0) {
      await mariadb.rollback();
      return { result: "fail" };
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
//순서
const getMaxProcSeq = async (prdCd) => {
  const result = await mariadb.query("ProcessSeq", prdCd);
  return result;
};


//-----------------------------자재관리----------------------------------
const bringMaterial = async()=>{
  let result = await mariadb.query("bringMat");
  return result;
};
//자재단건조회
const findMatInfo = async(no) =>{

  let list = await mariadb.query('matInfo',no);
  let info = list[0];
  return info;
}

//자재등록
const insertMaterial = async(matInfo)=>{
  let result = await mariadb.query('matInsert', matInfo);
  if( result.insertId > 0){
    return { mat_no : result.insertId }; 
  }else{
    return {};
  }
};

//자재수정
const updateMaterial = async(matCd,updateInfo)=>{
  let datas = [updateInfo, matCd];
  let result = await mariadb.query('matUpdate', datas);
  let sendData = {};
  if(result.changedRows == 1){
    sendData.target = { 'mat_cd' : matCd };
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}



module.exports = {
  //메소드명
  findBomByPc,
  createBom,
  findAllPrd,
  findAllMat,
  deleteBom,
  searchPrd,
  searchMtl,
  searchFlow,
  searchPrdUsage,
  searchProMtl,
  searchProcCd,
  insertProcMat,
  deleteProcessFlow,
  insertProcFlow,
  insertProcessMaterial,
  getMaxProcSeq,
  deleteProcessMtlFlow,
  bringMaterial,
  insertMaterial,
  updateMaterial,
  findMatInfo
};
