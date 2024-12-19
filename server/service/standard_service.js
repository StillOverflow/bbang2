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

// 공정 추가
const InsertProcMat = async (ProcMatInfro) => {
  let result = await mariadb.query("ProcMatInsert", ProcMatInfro);
  if (result.affectedRows > 0) {
    return { result: "success" };
  } else {
    return { result: "fail" };
  }
};

// 공정 삭제
const deleteProcessFlow = async (info) => {
  let result = await mariadb.query("deleteProcessFlow", info); //info 객체형태 전달
  return result;
};
// 공정 순서 업데이트
const updateProcessSequence = async (updatedProcesses) => {
  // updatedProcesses는 [{ proc_seq, proc_cd }, ...] 형식의 배열
  for (const process of updatedProcesses) {
    const result = await mariadb.query("updateProcessSequence", [
      process.proc_seq,
      process.proc_cd,
    ]);
    return result;
  }
};

//------------------공통코드----------------------
const findAllComm = async (comm_cd) => {
  let list = await mariadb.query("commList", comm_cd);
  return list;
};

module.exports = {
  //메소드명
  findBomByPc,
  createBom,
  findAllPrd,
  findAllMat,
  deleteBom,
  searchPrd,
  searchMtl,
  findAllComm,
  searchFlow,
  searchPrdUsage,
  searchProMtl,
  searchProcCd,
  InsertProcMat,
  deleteProcessFlow,
  updateProcessSequence,
};
