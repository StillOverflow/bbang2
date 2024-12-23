/* -----------생산계획서------------*/

//계획서 전체조회
const planList =
`SELECT PROD_PLAN_CD, 
        ORDER_CD, 
        ID, 
        START_DT, 
        END_DT, 
        CREATE_DT, 
	      (SELECT 
            COUNT(PROD_PLAN_QTY) 
      	 FROM 
            PROD_PLAN_DTL 
	       WHERE PROD_PLAN_CD = pp.PROD_PLAN_CD ) AS DTL_QTY 
FROM PROD_PLAN pp`;

//계획서 단건조회
const planSearch =
`SELECT PROD_PLAN_CD, 
        ORDER_CD, 
        ID, 
        START_DT, 
        END_DT, 
        CREATE_DT,
	      (SELECT 
            COUNT(PROD_PLAN_QTY) 
      	 FROM 
            PROD_PLAN_DTL 
	       WHERE PROD_PLAN_CD = pp.PROD_PLAN_CD ) AS DTL_QTY 
FROM PROD_PLAN pp
WHERE PROD_PLAN_CD LIKE "%"?"%"`;

//계획서 다중 삭제
const planDelete =
`DELETE FROM PROD_PLAN 
WHERE PROD_PLAN_CD IN "("?")"`;

//계획서 제품조회
const planDtlList =
`SELECT 
        PROD_PLAN_DTL_CD, 
        PROD_PLAN_CD, 
        pp.PRD_CD as PRD_CD, 
        PRD_NM, 
        PROD_PLAN_QTY,
        (SELECT 
            COUNT(*) 
         FROM 
            PROD_INST pi JOIN PROD_INST_DTL pid 
            ON pi.INST_CD=pid.INST_CD 
         WHERE pi.PROD_PLAN_CD = pp.prod_plan_cd AND pid.PRD_CD = pp.prd_cd) AS reg_cnt
FROM 
        PROD_PLAN_DTL pp JOIN PRODUCT p ON pp.PRD_CD = p.PRD_CD
WHERE PROD_PLAN_CD = ? `;


/* 계획서 등록[S] */

// 시퀀스 조회
const planSeq = `
  SELECT CONCAT('PR', LPAD(nextval(plan_seq), 3,'0')) seq
  FROM dual
`;

// 헤더 입력
const planInsert = `
  INSERT INTO PROD_PLAN SET ?
`;

// 디테일 입력
const planDtlInsert = (values) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT PROD_PLAN_DTL
      (PROD_PLAN_DTL_CD, PROD_PLAN_CD, PRD_CD, PROD_PLAN_QTY)
    VALUES 
  `;

  values.forEach((obj) => {
    sql += `(CONCAT('PRDTL', LPAD(nextval(plan_dtl_seq), 3,'0')), '${obj.PROD_PLAN_CD}', '${obj.PRD_CD}', '${obj.PROD_PLAN_QTY}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};
/* 계획서 등록[E] */


/* -----------생산지시서------------*/

//지시서 전체조회
const instList =
`SELECT INST_CD,
		 PROD_PLAN_CD,
		 fn_get_codename(STATUS) as ACT_TYPE,
		 WORK_DT,
		 CREATE_DT,
		(SELECT COUNT(*) FROM prod_inst_dtl WHERE INST_CD=PI.INST_CD) AS PRD_CNT
FROM PROD_INST pi`;

//지시서 단건조회
const instInfo =
`SELECT * FROM PROD_INST
WHERE INST_CD = ?`;


/* 지시서 등록[S] */

// 시퀀스 조회
const instSeq = `
  SELECT CONCAT('PI', LPAD(nextval(inst_seq), 3,'0')) seq
  FROM dual
`;

// 헤더 입력
const instInsert = `
  INSERT INTO PROD_INST SET ?
`;

// 디테일 입력
const instDtlInsert = (values) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT PROD_INST_DTL
      (INST_DTL_CD, INST_CD,PRD_CD, TOTAL_QTY)
    VALUES 
  `;

  values.forEach((obj) => {
    sql += `(CONCAT('PID', LPAD(nextval(inst_dtl_seq), 3,'0')), '${obj.INST_CD}', '${obj.PRD_CD}', '${obj.total_qty}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};

// 공정흐름 입력
const instFlowInsert = (values) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT PROD_PROC_STEP
      (INST_PROC_CD, INST_CD, PRD_CD, PROC_CD, STEP)
    VALUES 
  `;

  values.forEach((obj) => {
    sql += `(CONCAT('PIF', LPAD(nextval(inst_flow_seq), 3,'0')), '${obj.INST_CD}', '${obj.PRD_CD}', '${obj.PROC_CD}', '${obj.STEP}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환
  
  return sql;
};
/* 지시서 등록[E] */


//지시서 제품별 공정 조회
const instProcList =
`SELECT 
      PROC_FLOW_CD, 
      p.PROC_CD AS PROC_CD, 
      PROC_NM, 
      PROC_SEQ, 
      PRD_CD, 
      p.NOTE AS NOTE 
FROM 
      PROCESS p JOIN PROCESS_FLOW f ON p.PROC_CD=f.PROC_CD
WHERE PRD_CD = ? 
ORDER BY PROC_SEQ`;

//지시서 제품 공정별 자재 조회
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
        PROCESS p join PROCESS_FLOW pf 
        ON p.PROC_CD = pf.PROC_CD 
  WHERE PRD_CD=?
UNION
	SELECT 
        "data" AS CATE,
            "" AS PRD_CD,
        PROC_FLOW_CD,
        pm.MAT_CD AS MAT_CD, 
          pm.MAT_QTY,
        (SELECT MAT_NM FROM MATERIAL WHERE MAT_CD=pm.MAT_CD) AS MAT_NM,
        m.MAT_QTY_T
	FROM 
        PROC_fLOW_MTL pm 
      JOIN 
        (SELECT 
            MAT_CD, 
            SUM(MAT_QTY) AS MAT_QTY_T 
         FROM 
            MATERIAL_IN GROUP BY MAT_CD) m 
      ON pm.MAT_CD=m.MAT_CD 
	WHERE PROC_FLOW_CD=PROC_FLOW_CD
  ORDER BY PROC_FLOW_CD, field (cate, 'group', 'data');
`;

module.exports = {
    planList,
    planSearch,
    planSeq,
    planInsert,
    planDtlInsert,
    planDelete,
    planDtlList,

    instList,
    instInfo,
    instSeq,
    instInsert,
    instDtlInsert,
    instFlowInsert,

    instProcList,
    instProcMtList
}