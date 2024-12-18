/* -----------생산계획서------------*/

//전체조회
const planList =
`SELECT prod_plan_cd, 
        order_cd, 
        id, 
        start_dt, 
        end_dt, 
        create_dt, 
	    (SELECT COUNT(prod_plan_qty) 
      	 FROM prod_plan_dtl 
	     WHERE prod_plan_cd=pp.PROD_PLAN_CD ) AS dtl_qty 
FROM prod_plan pp;`;

//단건조회
const planInfo =
`SELECT * FROM prod_plan
WHERE PROD_PLAN_CD = ?`;

//등록
const planInsert =
`INSERT INTO prod_plan 
SET ? `;

//수정
const planUpdate =
`UPDATE prod_plan 
SET ? 
WHERE PROD_PLAN_CD IN "("?")"`;

//제품조회
const planDtlList =
`SELECT 
    prod_plan_dtl_cd, 
    prod_plan_cd, 
    a.prd_cd, 
    prd_nm, 
    prod_plan_qty
FROM prod_plan_dtl a JOIN product b ON a.PRD_CD = b.PRD_CD
WHERE PROD_PLAN_CD = ? `;

//제품수정
const planDtlUpdate =
`UPDATE prod_plan_dtl
SET ? `;



/* -----------생산지시서------------*/

//전체조회
const instList =
`SELECT * FROM prod_inst`;

//단건조회
const instInfo =
`SELECT * FROM prod_inst
WHERE INST_CD = ?`;

//등록
const instInsert =
`INSERT INTO prod_inst 
SET ? `;

//수정
const instUpdate =
`UPDATE prod_inst 
SET ? 
WHERE INST_CD = ?`;

//제품등록
const instDtlInsert =
`INSERT INTO prod_inst_dtl
SET ? `;

//제품수정
const instDtlUpdate =
`UPDATE prod_inst_dtl
SET ? 
WHERE INST_DTL_CD = ?`;

//제품별 공정 조회
const instProcList =
`SELECT PROC_FLOW_CD, p.PROC_CD AS PROC_CD, PROC_NM, PROC_SEQ, PRD_CD, p.NOTE AS NOTE 
FROM process p JOIN process_flow f ON p.PROC_CD=f.PROC_CD
WHERE PRD_CD = ? 
ORDER BY PROC_SEQ`;

//제품별 공정 등록
const instProcInsert =
`INSERT INTO prod_proc_step
SET ? `;

//제품별 공정 수정
const instProcUpdate =
`UPDATE prod_proc_step
SET ? `;

//제품 공정별 자재 조회
const instProcMtList =
`SELECT 
		"group" AS CATE,
        "" AS PRD_CD,
		PROC_FLOW_CD, 
		"" AS MAT_CD, 
        "" AS MAT_QTY,
		p.PROC_NM as NAME,
		0 AS MAT_QTY_T
	FROM 
		process p join process_flow pf 
		ON p.proc_cd = pf.proc_cd 
	WHERE PRD_CD=?
UNION
	SELECT 
		"data" AS CATE,
        "" AS PRD_CD,
		PROC_FLOW_CD,
		pm.MAT_CD AS MAT_CD, 
      pm.MAT_QTY,
		(SELECT mat_nm FROM material WHERE mat_cd=pm.MAT_CD) AS MAT_NM,
		m.MAT_QTY_T
	FROM 
		proc_flow_mtl pm JOIN (SELECT MAT_CD, SUM(MAT_QTY) AS MAT_QTY_T from material_in GROUP BY MAT_CD) m 
		ON pm.MAT_CD=m.MAT_CD 
	WHERE proc_flow_cd=PROC_FLOW_CD
order BY proc_flow_cd, field (cate, 'group', 'data');
`;

//제품 공정별 자재 등록
const instProcMtInsert =
`INSERT INTO process_flow_mtl
SET ? `;


/* -----------생산실적------------*/

//조회
const prRsList =
`SELECT * FROM PROD_RESULT
WHERE PROC_FLOW_CD = ? `;

module.exports = {
    planList,
    planInfo,
    planInsert,
    planUpdate,
    planDtlList,
    planDtlUpdate,

    instList,
    instInfo,
    instInsert,
    instUpdate,
    instDtlInsert,

    instDtlInsert,
    instDtlUpdate,
    instProcList,
    instProcInsert,
    instProcUpdate,
    instProcMtList,
    instProcMtInsert,
    prRsList
}