/* -----------생산계획서------------*/

//계획서 전체조회
const planSelect = (datas) => {
  let query =
          `SELECT PROD_PLAN_CD, 
                  ORDER_CD, 
                  ID, 
                  fn_get_codename(STATUS) as ACT_TYPE,
                  START_DT, 
                  END_DT, 
                  CREATE_DT,
                  (SELECT 
                      COUNT(PROD_PLAN_QTY) 
                  FROM 
                      PROD_PLAN_DTL 
                  WHERE PROD_PLAN_CD = pp.PROD_PLAN_CD ) AS DTL_QTY 
          FROM PROD_PLAN pp`;

 const searchOrder = [];

  // 거래처조회 조건
  if (datas.PROD_PLAN_CD) searchOrder.push(`PROD_PLAN_CD = UPPER('${datas.PROD_PLAN_CD}')`);
  if (datas.STATUS) searchOrder.push(`STATUS = UPPER('${datas.STATUS}')`);
  

  if (searchOrder.length > 0) {
    query += ` WHERE ` + searchOrder.join(' AND ');
  }

  return query; // 합체한 쿼리 전체
};


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
const planDelete = (datas) => {

  let sql =
      `DELETE FROM PROD_PLAN 
      WHERE PROD_PLAN_CD IN `;

  let delArr = [];
  delArr.push(Object.values(datas));
  delArr.join(", ");
  sql += "("+delArr + ")";
  
 return sql;
}


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


/* -----------생산지시서------------*/

//지시서 전체조회
const instList = (datas) => {
  let query =
 `SELECT INST_CD,
        PROD_PLAN_CD,
        fn_get_codename(STATUS) as ACT_TYPE,
        WORK_DT,
        CREATE_DT,
        (SELECT COUNT(*) FROM prod_inst_dtl WHERE INST_CD=PI.INST_CD) AS PRD_CNT
        FROM PROD_INST pi`;

 const searchOrder = [];

  // 거래처조회 조건
  if (datas.PROD_PLAN_CD) searchOrder.push(`INST_CD = UPPER('${datas.INST_CD}')`);
  if (datas.STATUS) searchOrder.push(`STATUS = UPPER('${datas.STATUS}')`);
  

  if (searchOrder.length > 0) {
    query += ` WHERE ` + searchOrder.join(' AND ');
  }
  
  return query; // 합체한 쿼리 전체
};


//지시서 단건조회
const instInfo =
`SELECT * FROM PROD_INST
WHERE INST_CD = ?`;

//계획서 다중 삭제
const instDelete = (datas) => {

  let sql =
      `DELETE FROM PROD_INST 
      WHERE INST_CD IN `;

  let delArr = [];
  delArr.push(Object.values(datas));
  delArr.join(", ");
  sql += "("+delArr + ")";
  
 return sql;
}

//지시서별 제품목록
const instDtlList = 
`
SELECT 
    INST_DTL_CD,
		pi.INST_CD AS INST_CD, 
		pi.ORDER_CD AS ORDER_CED, 
		STATUS, 
		PRD_CD, 
    (SELECT PRD_NM 
      FROM product 
      WHERE PRD_CD=pid.PRD_CD) AS PRD_NM, 
		TOTAL_QTY,
		(SELECT 
			ifnull(sum(PRD_OUT_QTY),0)
		from 
			product_out p JOIN product_out_detail pod 
			ON p.PRD_OUT_CD=pod.PRD_OUT_CD 
			WHERE p.order_cd=pi.order_cd
			AND PRD_CD=pid.PRD_CD
		) AS PRD_OUT_QTY
FROM 
	prod_inst PI JOIN prod_inst_dtl pid 
	ON PI.INST_CD=pid.INST_CD 
	WHERE pi.INST_CD=?;
`;


//제품별 공정 조회
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
      (INST_DTL_CD, INST_CD,PRD_CD, TOTAL_QTY, PROD_QTY)
    VALUES 
  `;

  values.forEach((obj) => {
    sql += `(CONCAT('PID', LPAD(nextval(inst_dtl_seq), 3,'0')), '${obj.INST_CD}', '${obj.PRD_CD}', '${obj.total_qty}', '${obj.PROD_QTY}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};

// 공정흐름 입력
const instFlowInsert = (values) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT PROD_RESULT
      (PROD_RESULT_CD, INST_CD, PRD_CD, PROC_FLOW_CD, PROC_CD, STEP)
    VALUES 
  `;

  values.forEach((obj) => {
    sql += `(CONCAT('PRS', LPAD(nextval(result_seq), 3,'0')), '${obj.INST_CD}', '${obj.PRD_CD}', '${obj.PROC_FLOW_CD}', '${obj.PROC_CD}', '${obj.STEP}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환
  
  return sql;
};

// 공정별 자재 입력
const instMatInsert = 
`INSERT INTO
  proc_mat (
      INST_MAT_CD
    ,PROC_FLOW_CD
    ,MAT_CD
    ,MAT_QTY
    ,MAT_USE_QTY
    ,UNIT
  )

SELECT 
    CONCAT('IM', LPAD(nextval(inst_mat_seq), 3,'0')) AS 'INST_MAT_CD',
    pf.PROC_FLOW_CD AS 'PROC_FLOW_CD',
    pf.MAT_CD AS MAT_CD,
    pf.MAT_QTY AS MAT_QTY,
    pf.MAT_QTY AS MAT_USE_QTY,
    UNIT AS 'UNIT'
  FROM
      proc_flow_mtl pf
    JOIN 
      (SELECT MAT_CD, MAT_NM, fn_get_codename(UNIT) AS UNIT FROM material) m on pf.MAT_CD=m.MAT_CD
      where pf.PROC_FLOW_CD = ?
`;
/* 지시서 등록[E] */


/*------------생산공정-------------*/

//지시서 단건조회
const resultInfo = (datas) => {
let sql = 
`SELECT *,
  (SELECT TOTAL_QTY FROM prod_inst_dtl where INST_CD=pr.INST_CD and PRD_CD=pr.PRD_CD) AS TOTAL_QTY,
  (SELECT EQP_NM FROM equipment where EQP_CD=pr.EQP_CD) AS EQP_NM ,
  (SELECT EQP_TYPE FROM process where proc_cd=pr.proc_cd) AS EQP_TYPE,
  (SELECT PROC_NM FROM process where proc_cd=pr.proc_cd) AS PROC_NM,
  fn_get_codename(pr.STATUS) as ACT_TYPE
FROM 
  PROD_RESULT pr`;

 const searchOrder = [];

  if (datas.PROD_RESULT_CD) searchOrder.push(`PROD_RESULT_CD = UPPER('${datas.PROD_RESULT_CD}')`);
  if (datas.INST_CD) searchOrder.push(`INST_CD = UPPER('${datas.INST_CD}')`);
  if (datas.PRD_CD) searchOrder.push(`PRD_CD = UPPER('${datas.PRD_CD}')`);
  if (datas.STATUS) searchOrder.push(`STATUS = UPPER('${datas.STATUS}')`);
  

  if (searchOrder.length > 0) {
    sql += ` WHERE ` + searchOrder.join(' AND ');
  }

  sql += ` order by STEP asc`;

  return sql; // 합체한 쿼리 전체
}

//지시서에 커스텀된 제품별 공정 조회
const instCusFlow = (datas) => {
  let sql = 
  `SELECT 
    PROD_RESULT_CD,
    PROC_FLOW_CD,
    INST_CD,
    PRD_CD,
    prs.PROC_CD,
    PROC_NM,
    EQP_TYPE,
    STEP,
    ID,
    fn_get_codename(prs.STATUS) as ACT_TYPE,
    START_TIME,
    END_TIME
  FROM prod_result prs JOIN (SELECT PROC_NM, EQP_TYPE, PROC_CD FROM process ) p
  ON prs.proc_cd=p.proc_cd`;
  
  const queryArr = [];

  // 거래처조회 조건
  if (datas.INST_CD) queryArr.push(`INST_CD = UPPER('${datas.INST_CD}')`);
  if (datas.PRD_CD) queryArr.push(`PRD_CD = UPPER('${datas.PRD_CD}')`);
  
  if (queryArr.length > 0) {
    sql += ` WHERE ` + queryArr.join(' AND ');
  }

  sql += ` order by STEP asc`; // 정렬

  return sql;
}


//공정별 설비 조회
const instCusEqu = 
`
SELECT 
	EQP_CD,
  EQP_TYPE,
	EQP_NM,
	MODEL,
  fn_get_codename(STATUS) as ACT_TYPE
FROM equipment WHERE eqp_type = ?
`;

//제품 공정별 자재 조회
const instProcMtList =
`SELECT 
    INST_MAT_CD,
    MAT_CD,
    MAT_QTY,   
    MAT_USE_QTY,
    (SELECT MAT_NM FROM material where MAT_CD=pf.MAT_CD) AS MAT_NM,
    UNIT
FROM
  proc_mat pf
where pf.PROC_FLOW_CD = ?  
`;

//제품 공정별 자재 사용량 등록
const instMatUpdate =
`UPDATE proc_mat 
SET MAT_USE_QTY=? 
WHERE INST_MAT_CD = ? `;

//생산공정 시작/종료
const processStart = 
`UPDATE prod_result 
SET ? 
WHERE PROD_RESULT_CD = ? `;

//자재 lot 조회
const matLotSearch =
`SELECT 
  MAT_LOT_CD,
  MAT_STOCK
FROM
  material_in
where MAT_CD = ? 
`;

//자재출고 등록
const matLotInsert = (values) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT material_out_detail
      (MAT_OUT_DTL_CD, MAT_OUT_DT, MAT_OUT_QTY, MAT_LOT_CD, MAT_CD, PROD_RESULT_CD)
    VALUES 
  `;

  values.forEach((obj) => {
    sql += `(CONCAT('MOD', LPAD(nextval(result_seq), 3,'0')), 
            now(), 
            '${obj.MAT_OUT_QTY}', 
            '${obj.MAT_LOT_CD}', 
            '${obj.MAT_CD}', 
            '${obj.PROD_RESULT_CD}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환
  return sql;
};


//자재수량 변경
const matLotUpdate = 
`UPDATE material_in 
SET MAT_STOCK = MAT_STOCK - ? 
WHERE MAT_LOT_CD = ? `;


module.exports = {
    planSelect,
    planSearch,
    planSeq,
    planInsert,
    planDtlInsert,
    planDelete,
    planDtlList,

    instList,
    instDtlList,
    instInfo,
    instSeq,
    instInsert,
    instDelete,
    instDtlInsert,
    instFlowInsert,
    instCusFlow,
    instCusEqu,

    instProcList,
    instProcMtList,
    instMatInsert,
    instMatUpdate,

    processStart,
    resultInfo,
    matLotSearch,
    matLotInsert,
    matLotUpdate
}