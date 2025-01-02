//----------------bom----------------------

//전체 제품조회
const prdList = `
SELECT prd_cd,
       prd_nm,
       create_dt,
       fn_get_codename(category) AS category
  FROM product
`;
//제품 키워드 검색
const prdSearch = `
SELECT prd_cd,
       prd_nm,
       create_dt,
       fn_get_codename(category) AS category
  FROM product
WHERE p.prd_nm like ?
`;
//자재 목록 조회
const matList = `
SELECT m.mat_cd,
       m.mat_nm,
       m.price,
       cd.comm_dtl_nm AS unit_nm,
       cd.comm_dtl_cd AS unit_cd,
       cd_t.comm_dtl_nm AS type
FROM material m
LEFT JOIN common_detail cd ON cd.comm_dtl_cd = m.unit
LEFT JOIN common_detail cd_t ON cd_t.comm_dtl_cd = m.type
`;
//자재 키워드 검색
const matSearch = `
SELECT m.mat_cd,
       m.mat_nm,
       m.price,
       cd.comm_dtl_nm AS unit_nm,
       cd.comm_dtl_cd AS unit_cd,
       cd_t.comm_dtl_nm AS TYPE
  FROM material m
LEFT JOIN common_detail cd ON cd.comm_dtl_cd = m.unit
LEFT JOIN common_detail cd_t ON cd_t.comm_dtl_cd = m.type
WHERE m.mat_nm LIKE ?
`;

//bom 조회
const bomlist = `
SELECT b.prd_cd,
       b.mat_cd,
       m.mat_nm,
       m.price,
       b.usage,
       cd.comm_dtl_nm AS unit
FROM bom b
JOIN material m ON b.mat_cd = m.mat_cd
JOIN common_detail cd ON b.unit = cd.comm_dtl_cd
AND cd.comm_cd = 'UN'
WHERE b.prd_cd=?
`;
//bom 자재추가
const bomInsert = `
insert into bom
set  ?
`;
//bom 자재삭제
const bomDel = `
delete from bom
where prd_cd = ?
and mat_cd = ?
`;
//--------------공정흐름도-----------------
//선택할 제품조회
const selectPrd = `
SELECT prd_cd,
       prd_nm
FROM product;
`;
// ----------------------공정흐름 관리---------------------

//선택한 제품의 공정흐름도 조회
const procFlowByProd = `
SELECT p.proc_cd,
       p.proc_nm,
       pf.proc_seq,
       pf.proc_flow_cd
FROM process_flow pf
JOIN process p ON p.proc_cd = pf.proc_cd
WHERE prd_cd = ?
ORDER BY pf.proc_seq
`;
//공정코드 조회(모달)
const selectProcCd = `
SELECT proc_cd,
       proc_nm,
       eqp_type,
       duration
FROM process;
`;

//공정흐름도에 공정코드 등록
const insertProcFlow = `
INSERT INTO process_flow
SET ?
`;

//공정흐릌도 코드 시퀀스 생성
const procFlowSeq = `
SELECT CONCAT('PF', LPAD(nextval(proc_flow_seq), 3, '0')) AS seq
FROM dual;
`;
// 공정 삭제
const deleteProcessFlow = `
DELETE
FROM process_flow
WHERE proc_flow_cd = ?
`;

//흐름도삭제시 자재도 삭제
const deleteProcFlowMtl=
`
delete 
from proc_flow_mtl 
where proc_flow_cd = ?
`;
//------------------------공정별 자재관리--------------------------
//공정자재 조회
const selectMatByProc = `
SELECT m.mat_cd ,
       m.mat_nm ,
       pfm.mat_qty ,
       pfm.proc_mat_flow_cd ,
       cd.comm_dtl_nm AS unit
FROM proc_flow_mtl pfm
JOIN process_flow pf  ON pfm.PROC_FLOW_CD = pf.PROC_FLOW_CD
JOIN material m ON m.mat_cd = pfm.mat_cd
JOIN common_detail cd ON cd.COMM_DTL_CD = m.unit
WHERE pf.proc_flow_cd = ?
`;

//제품별 공정자재 조회
const selectAllMatByProc=
`SELECT m.mat_cd ,
       m.mat_nm ,
       pfm.mat_qty ,
       pfm.proc_mat_flow_cd ,
       cd.comm_dtl_nm AS unit
FROM proc_flow_mtl pfm
JOIN process_flow pf  ON pfm.PROC_FLOW_CD = pf.PROC_FLOW_CD
JOIN material m ON m.mat_cd = pfm.mat_cd
JOIN common_detail cd ON cd.COMM_DTL_CD = m.unit
WHERE pfm.prd_cd = ?`;
//공정별자재코드 시퀀스 생성
const procMtlSeq = `
SELECT CONCAT('PMF', LPAD(nextval(proc_mat_flow_seq), 3, '0')) AS seq
FROM dual;
`;
//공정별 자재 추가
const insertProcessMtlFlow = `
INSERT INTO proc_flow_mtl 
SET ?
`;
//공정별 자재 삭제
const deleteProcessMtlFlow = `
DELETE 
FROM proc_flow_mtl 
WHERE proc_mat_flow_cd = ? 
`;
// 공정 순서
const ProcessSeq = `
SELECT MAX(proc_seq) AS maxSeq 
FROM process_flow 
WHERE prd_cd = ?
`;

//공정순서 업데이트
const updateProSeq = 
`
UPDATE process_flow
SET proc_seq =?
WHERE proc_flow_cd =?
`;

//제품자재별 자재 사용량 계산
const selectProcMtlsUsage =
`
SELECT mat_qty
FROM proc_flow_mtl
WHERE mat_cd = ?
AND prd_cd = ?
`;

//공정별 자재 사용량 업데이트
const updateProcMtl =
`
UPDATE proc_material
SET mat_qty = ?
WHERE proc_mat_flow_cd = ?
`;
//---------------------자재관리--------------------------
//자재목록전체 조회
const bringMat = 
`
SELECT mat_cd,
       mat_nm,
       fn_get_codename(TYPE) AS type,
       price,
       safe_stk,
       note,
       create_dt,
       fn_get_codename(category) AS category,
       fn_get_codename(unit) AS unit
FROM material
`;

//등록전 마지막 자재코드 찾기+1
const getMatCd = 
`
SELECT CONCAT('MA', LPAD(IFNULL(MAX(CAST(SUBSTR(mat_cd, 3) AS UNSIGNED)) + 1, 1), 3, '0')) AS mat_cd
FROM material
`
//자재등록
const matInsert = 
`
INSERT INTO material 
SET ? `;
//수정
const matUpdate = 
`
UPDATE material 
SET ? 
WHERE mat_cd = ?
`;
//삭제
const matDelete =
`
DELETE
FROM material
WHERE mat_cd = ?
`;

//----------------------------------------제품관리------------------------------------------------
//등록전 마지막 제품코드 찾기+1
const getPrdCd = 
`
SELECT 
CONCAT('PR', LPAD(IFNULL(MAX(CAST(SUBSTR(prd_cd, 3) AS UNSIGNED)) + 1, 1), 3, '0')) AS prd_cd
FROM product
`

//제품등록
const prdInsert=
`
INSERT INTO product
SET ?
`;

//수정
const prdUpdate = `
UPDATE product 
SET ? 
WHERE prd_cd = ?`;

//삭제
const prdDelete =
`
DELETE
FROM product
WHERE prd_cd = ?
`;
//----------------------------------공정관리--------------------------------------------
//공점검색
const processSelect = (datas)=>{
    let query = 
    `
    SELECT proc_cd,
           proc_nm,
           fn_get_codename(eqp_type) AS eqp_type,
           duration,
           note,
           create_dt
    FROM process
    `;

    const conditions = [];

      // 상품조회 조건
    if(datas.proc_nm) conditions.push(`proc_nm LIKE '%${datas.proc_nm}%'`);

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY proc_cd`;

    return query;
}

//등록전 마지막 제품코드 찾기+1
const getProcCd = 
`
SELECT 
CONCAT(?, LPAD(IFNULL(MAX(CAST(SUBSTR(proc_cd, 3) AS UNSIGNED)) + 1, 1), 3, '0')) AS proc_cd
FROM process
`
//등록
const procInsert=
`
INSERT INTO process
SET ?
`;
//수정
const procUpdate = `
UPDATE process 
SET ? 
WHERE proc_cd = ?`;

//삭제
const procDelete =
`
DELETE
FROM process
WHERE proc_cd = ?
`;

//-------------------------------------거래처관리------------------------------------------------
//등록전 마지막 제품코드 찾기+1
const getActCd = 
`
SELECT 
CONCAT('AC', LPAD(IFNULL(MAX(CAST(SUBSTR(act_cd, 3) AS UNSIGNED)) + 1, 1), 3, '0')) AS act_cd
FROM account
`

//제품등록
const actInsert=
`
INSERT INTO account
SET ?
`;

//수정
const actUpdate = `
UPDATE account 
SET ? 
WHERE act_cd = ?`;

//삭제
const actDelete =
`
DELETE
FROM account
WHERE act_cd = ?
`;

//-------------------------------------불량관리------------------------------------------------
//불량코드검색
const defectSelect = (datas)=>{
    let query = 
    `
    SELECT def_cd,
           def_nm,
           fn_get_codename(def_type) AS def_type,
           def_detail,
           note
    FROM defect
    `;

    const conditions = [];

      // 상품조회 조건
    if(datas.def_nm) conditions.push(`def_nm LIKE '%${datas.def_nm}%'`);

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY def_cd`;

    return query;
}

//등록전 마지막 불량코드 찾기+1
const getDefCd = 
`
SELECT 
CONCAT('DEF', LPAD(IFNULL(MAX(CAST(SUBSTR(def_cd, 4) AS UNSIGNED)) + 1, 1), 3, '0')) AS def_cd
FROM defect
`

//불량코드등록
const defInsert=
`
INSERT INTO defect
SET ?
`;

//수정
const defUpdate = `
UPDATE defect 
SET ? 
WHERE def_cd = ?`;

//삭제
const defDelete =
`
DELETE
FROM defect
WHERE def_cd = ?
`;

//----------------------------------------사원관리----------------------------------------
// 사원 테이블에서 마지막 사원아이디 찾기
const getMemCd = `
SELECT 
LPAD(IFNULL(MAX(CAST(SUBSTR(mem_cd, 2) AS UNSIGNED)) + 1, 1),3,'0') AS mem_cd
FROM member;
`;

// 사원 테이블에서 마지막 사원코드 찾기
const getMemId = `
SELECT 
CONCAT('me', LPAD(IFNULL(MAX(CAST(SUBSTR(id, 3) AS UNSIGNED)) + 1, 1), 3, '0')) AS id
FROM member;
`;
//사원등록
const memInsert=
`
INSERT INTO member
SET ?
`;
//수정
const memUpdate = `
UPDATE member 
SET ? 
WHERE mem_cd = ?`;

//부서불러오기
const depSelect =
`
SELECT
dpt_cd, 
dpt_nm
from department
`;

module.exports = {
  //bom
prdList,
prdSearch,
matList,
matSearch,
bomlist,
bomInsert,
bomDel,

//공정흐름도
selectPrd,
procFlowByProd,
selectProcCd,
insertProcFlow,
procFlowSeq,
deleteProcessFlow,
selectMatByProc,
procMtlSeq,
insertProcessMtlFlow,
deleteProcessMtlFlow,
ProcessSeq,
updateProSeq,
selectAllMatByProc,


//자재관리
bringMat,
getMatCd,
matInsert,
matUpdate,
matDelete,

//제품관리
getPrdCd,
prdInsert,
prdUpdate,
prdDelete,

//공정관리
processSelect,
getProcCd,
procInsert,
procUpdate,
procDelete,

//거래처관리
getActCd,
actInsert,
actUpdate,
actDelete,

//불량코드관리
defectSelect,
getDefCd,
defInsert,
defUpdate,
defDelete,

//사원관리
getMemCd,
memInsert,
memUpdate,
getMemId,
depSelect




,selectProcMtlsUsage,
updateProcMtl,
deleteProcFlowMtl
};
