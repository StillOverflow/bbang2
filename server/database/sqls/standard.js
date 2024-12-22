//----------------bom----------------------

//전체 제품조회
const prdList = `
SELECT
    p.prd_cd, 
    p.prd_nm,
    b.create_dt AS create_dt,  
    cd.comm_dtl_nm AS usage_sta  
FROM product p
	LEFT outer JOIN bom b 
    ON p.prd_cd = b.prd_cd
	LEFT JOIN common_detail cd
    ON cd.comm_dtl_cd = b.usage_sta
	GROUP BY prd_cd
`;
//제품 키워드 검색
const prdSearch = `
SELECT
    p.prd_cd, 
    p.prd_nm,
    b.create_dt AS create_dt,  
    cd.comm_dtl_nm AS usage_sta  
FROM product p
	LEFT outer JOIN bom b 
    ON p.prd_cd = b.prd_cd
	LEFT JOIN common_detail cd
    ON cd.comm_dtl_cd = b.usage_sta
	 
where p.prd_nm like ?
GROUP BY prd_cd
`;
//자재 목록 조회
const matList = `
SELECT 
    m.mat_cd, 
    m.mat_nm,   
    m.price,
    cd.comm_dtl_nm AS unit_nm,
    cd.comm_dtl_cd AS unit_cd,
    cd_t.comm_dtl_nm AS type
FROM material m
LEFT JOIN common_detail cd
    ON cd.comm_dtl_cd = m.unit
LEFT JOIN common_detail cd_t
    ON cd_t.comm_dtl_cd = m.type 
`;
//자재 키워드 검색
const matSearch = `
SELECT 
    m.mat_cd, 
    m.mat_nm,   
    m.price,
    cd.comm_dtl_nm AS unit_nm,
    cd.comm_dtl_cd AS unit_cd,
    cd_t.comm_dtl_nm AS type
FROM material m
LEFT JOIN common_detail cd
    ON cd.comm_dtl_cd = m.unit
LEFT JOIN common_detail cd_t
    ON cd_t.comm_dtl_cd = m.type 
WHERE m.mat_nm LIKE ?
`;

//bom 조회
const bomlist = `
select
b.prd_cd
,b.mat_cd
,m.mat_nm
,m.price
,b.usage
,cd.comm_dtl_nm AS unit
from bom b
join material m ON b.mat_cd = m.mat_cd
join common_detail cd ON b.unit = cd.comm_dtl_cd
                        and cd.comm_cd = 'UN'
where b.prd_cd=?
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
SELECT
prd_cd
,prd_nm,
(SELECT EXISTS(
        SELECT 1
        FROM prod_inst_dtl
        WHERE prd_cd = 'pr01')) AS "useSta"
FROM product; 
`;
// ----------------------공정흐름 관리---------------------

//선택한 제품의 공정흐름도 조회
const procFlowByProd = `
SELECT 
p.proc_cd
,p.proc_nm
,pf.proc_seq
,pf.proc_flow_cd
FROM process_flow pf
JOIN process p
ON p.proc_cd = pf.proc_cd
WHERE prd_cd = ?
order by pf.proc_seq
`;
//공정코드 조회(모달)
const selectProcCd = `
SELECT
proc_cd
,proc_nm
,eqp_type
,duration
FROM process;
`;

//공정흐름도에 공정코드 등록
const insertProcFlow = `
insert into process_flow
set ?
`;

//공정흐릌도 코드 시퀀스 생성
const procFlowSeq = `
SELECT CONCAT('PF', LPAD(nextval(proc_flow_seq), 3, '0')) AS seq
FROM dual;
`;
// 공정 삭제
const deleteProcessFlow = `
DELETE FROM process_flow 
WHERE proc_flow_cd = ?
`;
//------------------------공정별 자재관리--------------------------
//공정자재 조회
const selectMatByProc = `
SELECT 
m.mat_cd
,m.mat_nm
,pfm.mat_qty
,pfm.proc_mat_flow_cd
,cd.comm_dtl_nm AS unit
from proc_flow_mtl pfm
join process_flow pf
ON pfm.PROC_FLOW_CD = pf.PROC_FLOW_CD
JOIN material m
ON m.mat_cd = pfm.mat_cd
JOIN common_detail cd
ON cd.COMM_DTL_CD = m.unit
WHERE pf.proc_flow_cd = ?
`;

//공정별자재코드 시퀀스 생성
const procMtlSeq = `
  SELECT CONCAT('PMF', LPAD(nextval(proc_mat_flow_seq), 3, '0')) AS seq
  FROM dual;
`;
//공정별 자재 추가
const insertProcessMtlFlow = `
INSERT INTO proc_flow_mtl SET ?
`;
//공정별 자재 삭제
const deleteProcessMtlFlow = `
DELETE FROM proc_flow_mtl 
WHERE proc_mat_flow_cd = ? 
`;
// 공정 순서
const ProcessSeq = `
    SELECT MAX(proc_seq) AS maxSeq 
    FROM process_flow 
    WHERE prd_cd = ?
`;

module.exports = {
  bomlist,
  prdList,
  matList,
  bomInsert,
  bomDel,
  prdSearch,
  matSearch,
  procFlowByProd,
  selectProcCd,
  insertProcFlow,
  selectPrd,
  selectMatByProc,
  deleteProcessFlow,
  ProcessSeq,
  insertProcessMtlFlow,
  procFlowSeq,
  procMtlSeq,
  deleteProcessMtlFlow,
};
