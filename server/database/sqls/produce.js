/* -----------생산계획서------------*/

//전체조회
const planList =
`SELECT * FROM prod_plan`;

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
WHERE PROD_PLAN_CD = ?`;

//제품조회
const planDtlList =
`SELECT * FROM prod_plan_dtl
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
const nstDtlInsert =
`INSERT INTO prod_inst_dtl
SET ? `;

//제품수정
const nstDtlUpdate =
`UPDATE prod_inst_dtl
SET ? 
WHERE INST_DTL_CD = ?`;

//제품별 공정 조회
const instProcList =
`SELECT * FROM process_flow
WHERE PRD_CD = ? `;

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
`SELECT * FROM process_flow_mtl
WHERE PROC_FLOW_CD = ? `;

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

}