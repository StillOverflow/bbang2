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
	 GROUP BY prd_cd
where p.prd_nm like ?
`;
//자재 목록 조회
const matList = `
select 
    mat_cd, 
    m.mat_nm,   
    m.price,
    cd.comm_dtl_nm as unit_nm,
    cd.comm_dtl_cd as unit_cd,
    cd_t.comm_dtl_nm as type
from material m
left join common_detail cd
    on cd.comm_dtl_cd = m.unit
left join common_detail cd_t
    on cd_t.comm_dtl_cd = m.type
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
    ON cd_t.comm_dtl_cd = m.type;
where mat_nm like ?
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
//선택한 제품의 공정흐름도 조회
const procFlowByProd = `
SELECT 
p.proc_cd
,p.proc_nm
,pf.proc_seq
FROM process_flow pf
JOIN process p
ON p.proc_cd = pf.proc_cd
WHERE prd_cd = ?
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
//공정흐름도에 선택한 공정코드 등록
const insertProcFlow = `
insert into process_flow
set ?
`;
//공정흐름도의 공정코드 삭제
const deleteProcFlow = `

`;

//선택한 제품의 bom조회 위에있음(o)

//bom내역에서 선택한 자재 공정흐름도 공정코드 조회

//선택한 공정흐름도의 공정코드에대한 자재정보 조회
const selectMatByProc = `
SELECT 
m.mat_cd
,m.mat_nm
,pfm.mat_qty
,cd.comm_dtl_nm AS unit
FROM process_flow pf
JOIN proc_flow_mtl pfm
ON pfm.PROC_FLOW_CD = pf.PROC_FLOW_CD
JOIN material m
ON m.mat_cd = pfm.mat_cd
JOIN common_detail cd
ON cd.COMM_DTL_CD = m.unit
WHERE pf.proc_cd = ?;
`;
//선택한 공정흐름도의 공정코드에대한 자재삭제

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
  deleteProcFlow,
  selectPrd,
  selectMatByProc,
};
