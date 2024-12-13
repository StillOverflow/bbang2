/* -----------생산계획서------------*/

//등록
const prPlanInsert =
`INSERT INTO prod_plan 
SET ? `;

//수정
const prPlanUpdate =
`UPDATE prod_plan 
SET ? 
WHERE PROD_PLAN_CD = ?`;

//제품조회
const prPlanDtlInsert =
`SELECT * FROM prod_plan_dtl
WHERE PROD_PLAN_CD = ? `;

//제품수정
const prPlanDtlInsert =
`UPDATE prod_plan_dtl
SET ? `;



/* -----------생산지시서------------*/

//등록
const prInstInsert =
`INSERT INTO prod_inst 
SET ? `;

//수정
const prInstUpdate =
`UPDATE prod_inst 
SET ? 
WHERE INST_CD = ?`;

//제품등록
const prInstDtlInsert =
`INSERT INTO prod_inst_dtl
SET ? `;

//제품수정
const prInstDtlInsert =
`UPDATE prod_inst_dtl
SET ? 
WHERE INST_DTL_CD = ?`;

//제품별 공정 조회
const prInstProcList =
`SELECT * FROM process_flow
WHERE PRD_CD = ? `;

//제품별 공정 등록
const prInstProcInsert =
`INSERT INTO prod_proc_step
SET ? `;

//제품별 공정 수정
const prInstProcUpdate =
`UPDATE prod_proc_step
SET ? `;

//제품 공정별 자재 조회
const prInstProcMtList =
`SELECT * FROM process_flow_mtl
WHERE PROC_FLOW_CD = ? `;

//제품 공정별 자재 등록
const prInstProcMtInsert =
`INSERT INTO process_flow_mtl
SET ? `;


/* -----------생산실적------------*/

//조회
const prRsList =
`SELECT * FROM PROD_RESULT
WHERE PROC_FLOW_CD = ? `;

module.exports = {

}