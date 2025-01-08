/* -------------------------------생산계획서----------------------------*/

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
                  STATUS,
                  (SELECT 
                      COUNT(PROD_PLAN_QTY) 
                  FROM 
                      PROD_PLAN_DTL 
                  WHERE PROD_PLAN_CD = pp.PROD_PLAN_CD ) AS DTL_QTY 
          FROM PROD_PLAN pp`;

 const searchOrder = [];

  // 거래처조회 조건
  if (datas.PROD_PLAN_CD) searchOrder.push(`PROD_PLAN_CD LIKE UPPER('%${datas.PROD_PLAN_CD}%')`);
  if (datas.STATUS) searchOrder.push(`STATUS = UPPER('${datas.STATUS}')`);
  if (datas.NOT_STATUS) searchOrder.push(`STATUS != UPPER('${datas.NOT_STATUS}')`);
  

  if (searchOrder.length > 0) { //조건이 있으면
    query += ` WHERE ` + searchOrder.join(' AND ');
  }

  query += ` order by create_dt desc`;

  return query; // 쿼리 통합
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

  //계획서 헤더/디테일 동시삭제
  let sql =
      `DELETE PROD_PLAN, PROD_PLAN_DTL FROM PROD_PLAN PROD_PLAN right join PROD_PLAN_DTL PROD_PLAN_DTL
        ON PROD_PLAN.PROD_PLAN_CD=PROD_PLAN_DTL.PROD_PLAN_CD
        WHERE STATUS='Z01' and PROD_PLAN_DTL.PROD_PLAN_CD IN `;

  let delArr = [];
  delArr.push(Object.values(datas));
  delArr.join(", ");
  sql += "("+delArr + ")";
  
 return sql;
}


/* 계획서 등록 [S] */

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
const planDtlDelete = 
`
DELETE FROM PROD_PLAN_DTL
WHERE PROD_PLAN_CD = ?
`;

// 디테일 등록
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


//계획서 헤더 수정
const planUpdate = `
  UPDATE PROD_PLAN SET ?
  WHERE PROD_PLAN_CD = ?
`;

//계획서 제품조회
const planDtlList =
`SELECT 
        prod_plan_dtl_cd, 
        prod_plan_cd, 
        pp.PRD_CD as prd_cd, 
        prd_nm, 
        prod_plan_qty as order_qty,
        (SELECT SUM(STOCK)
         FROM product_in
         WHERE PRD_CD = p.PRD_CD ) AS in_cnt,
        (SELECT 
            COUNT(*) 
         FROM 
            PROD_INST pi JOIN PROD_INST_DTL pid 
            ON pi.INST_CD=pid.INST_CD 
         WHERE pi.PROD_PLAN_CD = pp.prod_plan_cd AND pid.PRD_CD = pp.prd_cd) AS reg_cnt,
         (SELECT COUNT(*) FROM process_flow where prd_cd=pp.PRD_CD) AS flow_cnt,
         (SELECT COUNT(*) FROM proc_flow_mtl where prd_cd=pp.PRD_CD) AS mtl_cnt,
          IFNULL((SELECT sum(PASS_QTY)
            FROM prod_inst pi left join prod_inst_dtl pid
            on PI.INST_CD=pid.INST_CD 
          WHERE pi.prod_plan_cd=pp.prod_plan_cd AND PRD_CD=pp.PRD_CD),0) AS PASS_QTY
FROM 
        PROD_PLAN_DTL pp JOIN PRODUCT p ON pp.PRD_CD = p.PRD_CD
WHERE PROD_PLAN_CD = ? `;


/* -------------------------------생산지시서----------------------------*/

//지시서 전체조회
const instList = (datas) => {
  let query =
 `SELECT INST_CD,
        PROD_PLAN_CD,
        (SELECT fn_get_codename(STATUS) FROM prod_plan where PROD_PLAN_CD=pi.PROD_PLAN_CD) as PLAN_STATUS,
        WORK_DT,
        CREATE_DT,
        (SELECT COUNT(*) FROM prod_inst_dtl WHERE INST_CD=PI.INST_CD) AS PRD_CNT,
        (SELECT COUNT(*) FROM prod_inst_dtl WHERE INST_CD=PI.INST_CD ANd STATUS='Z03') AS END_CNT
        FROM PROD_INST pi`;

 const searchOrder = [];

  // 거래처조회 조건
  if (datas.INST_CD) searchOrder.push(`INST_CD LIKE UPPER('%${datas.INST_CD}%')`);
  //if (datas.STATUS) searchOrder.push(`STATUS = UPPER('${datas.STATUS}')`);

  if (searchOrder.length > 0) {
    query += ` WHERE ` + searchOrder.join(' AND ');
  }
  
  return query; // 합체한 쿼리 전체
};

//지시서 단건조회
const instInfo =
`SELECT * FROM PROD_INST
WHERE INST_CD = ?`;

//지시서 다중 삭제
const instDelete = (datas) => {

  //공정실적, 사용자재, 지시서 헤더/디테일 동시삭제
  let sql =
      `DELETE PROD_INST, prod_inst_dtl, prod_result, proc_mat FROM 
		    PROD_INST PROD_INST JOIN prod_plan prod_plan ON prod_inst.PROD_PLAN_CD=prod_plan.PROD_PLAN_CD
							    	 JOIN prod_inst_dtl prod_inst_dtl ON prod_inst.INST_CD=prod_inst_dtl.INST_CD
		  					       JOIN prod_result prod_result ON prod_inst.INST_CD=prod_result.INST_CD
							       JOIN proc_mat proc_mat ON prod_inst.INST_CD=proc_mat.INST_CD
        WHERE prod_plan.STATUS!='Z03' and PROD_INST.INST_CD IN `;

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
		fn_get_codename(STATUS) as ACT_TYPE,
		PRD_CD, 
    (SELECT PRD_NM 
      FROM product 
      WHERE PRD_CD=pid.PRD_CD) AS PRD_NM, 
		TOTAL_QTY,
		(SELECT 
			ifnull(sum(PRD_QTY),0)
		from 
			product_in where INST_CD=pi.INST_CD
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

// 헤더 시퀀스 조회
const instSeq = 
`SELECT CONCAT('PI', LPAD(IFNULL(MAX(SUBSTR(pi.INST_CD, -3)) + 1, 1), 3, '0')) AS seq FROM prod_inst pi`;

// 헤더 입력
const instInsert = `
  INSERT INTO PROD_INST SET ?
`;

// 디테일 시퀀스 조회
const instDtlSeq = 
`SELECT CONCAT('PID', LPAD(IFNULL(MAX(SUBSTR(pid.INST_DTL_CD, -3)) + 1, 1), 3, '0')) AS seq FROM prod_inst_dtl pid`;

// 디테일 입력
const instDtlInsert = (obj) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT PROD_INST_DTL
      (INST_DTL_CD, INST_CD,PRD_CD, TOTAL_QTY)
    VALUES 
  `;

  sql += `('${obj.inst_dtl_cd}', '${obj.inst_cd}', '${obj.prd_cd}', '${obj.total_qty}'), `;

  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};



// 공정흐름 시퀀스 조회
const instFlowSeq = 
`SELECT CONCAT('PRS', LPAD(IFNULL(MAX(SUBSTR(pr.PROD_RESULT_CD, -3)) + 1, 1), 3, '0')) AS seq FROM PROD_RESULT pr`;

// 공정흐름 입력
const instFlowInsert = (obj) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT PROD_RESULT
      (PROD_RESULT_CD, INST_CD, PRD_CD, PROC_FLOW_CD, PROC_CD, STEP)
    VALUES 
  `;

  sql += `('${obj.prod_result_cd}', '${obj.inst_cd}', '${obj.PRD_CD}', '${obj.PROC_FLOW_CD}', '${obj.PROC_CD}', '${obj.STEP}'), `;
 
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환
  
  return sql;
};



// 공정흐름 시퀀스 조회
const instMatSeq = 
`SELECT CONCAT('IM', LPAD(IFNULL(MAX(SUBSTR(pm.INST_MAT_CD, -3)) + 1, 1), 3, '0')) AS seq FROM proc_mat pm`;

// 공정별 자재 입력
const instMatInsert = (values) => { 
  let sql = 
  `INSERT INTO
    proc_mat (
      INST_MAT_CD
      ,INST_CD
      ,PROC_FLOW_CD
      ,MAT_CD
      ,MAT_QTY
      ,MAT_USE_QTY
      ,UNIT
    )

  SELECT 
      '${values.INST_MAT_CD}',
      (SELECT INST_CD FROM prod_inst WHERE inst_cd='${values.INST_CD}'),
      pf.PROC_FLOW_CD AS 'PROC_FLOW_CD',
      pf.MAT_CD AS MAT_CD,
      pf.MAT_QTY AS MAT_QTY,
      pf.MAT_QTY AS MAT_USE_QTY,
      UNIT AS 'UNIT'
    FROM
        proc_flow_mtl pf
      JOIN 
        (SELECT MAT_CD, MAT_NM, fn_get_codename(UNIT) AS UNIT FROM material) m on pf.MAT_CD=m.MAT_CD
        where pf.PROC_FLOW_CD = '${values.PROC_FLOW_CD}'
  `;

  return sql;
}
/* 지시서 등록[E] */


/* -------------------------------생산실적관리----------------------------*/

//실적테이블 단건조회
const resultInfo = (datas) => {
let sql = 
`SELECT *,
  (SELECT TOTAL_QTY FROM prod_inst_dtl where INST_CD=pr.INST_CD and PRD_CD=pr.PRD_CD) AS TOTAL_QTY,
  (SELECT EQP_NM FROM equipment where EQP_CD=pr.EQP_CD) AS EQP_NM ,
  (SELECT EQP_TYPE FROM process where proc_cd=pr.proc_cd) AS EQP_TYPE,
  (SELECT PRD_NM FROM product WHERE PRD_CD=pr.PRD_CD) PRD_NM,
  (SELECT PROC_NM FROM process where proc_cd=pr.proc_cd) AS PROC_NM,
  IFNULL((SELECT PASS_QTY FROM prod_result WHERE inst_cd=pr.INST_CD AND prd_cd=pr.PRD_CD AND step=(pr.step-1)),0) AS LAST_PASS_QTY,
  IFNULL((SELECT STATUS FROM prod_result WHERE inst_cd=pr.INST_CD AND prd_cd=pr.PRD_CD AND step=(pr.step-1)),0) AS LAST_STATUS,
  IFNULL((SELECT QUE_STATUS FROM prod_result WHERE inst_cd=pr.INST_CD AND prd_cd=pr.PRD_CD AND step=(pr.step-1)),0) AS LAST_QUE_STATUS,
  fn_get_codename(pr.STATUS) as ACT_TYPE,
  fn_get_codename(pr.QUE_STATUS) as QUE_ACT_TYPE
FROM 
  PROD_RESULT pr LEFT join (SELECT REFER_CD, DEF_CD FROM quality_test_record) qt on pr.PROD_RESULT_CD=qt.REFER_CD `;

 const searchOrder = [];

  if (datas.PROD_RESULT_CD) searchOrder.push(`PROD_RESULT_CD = UPPER('${datas.PROD_RESULT_CD}')`);
  if (datas.INST_CD) searchOrder.push(`INST_CD = UPPER('${datas.INST_CD}')`);
  if (datas.PRD_CD) searchOrder.push(`PRD_CD = UPPER('${datas.PRD_CD}')`);
  if (datas.STATUS) searchOrder.push(`STATUS = UPPER('${datas.STATUS}')`);
  

  if (searchOrder.length > 0) {
    sql += ` WHERE ` + searchOrder.join(' AND ');
  }

  sql += ` order BY prd_cd, step asc`;

  return sql; // 합체한 쿼리 전체
}

//커스텀된 공정흐름 조회
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

  // 조회 조건
  if (datas.INST_CD) queryArr.push(`INST_CD = UPPER('${datas.INST_CD}')`);
  if (datas.PRD_CD) queryArr.push(`PRD_CD = UPPER('${datas.PRD_CD}')`);
  
  if (queryArr.length > 0) {
    sql += ` WHERE ` + queryArr.join(' AND ');
  }

  sql += ` order by STEP asc`; // 정렬

  return sql;
}


//커스텀된 공정흐름별 설비목록 조회
const instCusEqu = 
`
SELECT 
	EQP_CD,
  EQP_TYPE,
	EQP_NM,
	MODEL,
  fn_get_codename(STATUS) as ACT_TYPE,
  (SELECT COUNT(*)
    FROM prod_result
  WHERE start_time IS NOT NULL AND (end_time IS NULL OR end_time = '')) AS use_cnt
FROM equipment WHERE eqp_type = ?
`;

//커스텀된 공정흐름별 자재목록 조회
const instProcMtList = (values) => {
  let sql = 
    `SELECT 
        INST_MAT_CD,
        MAT_CD,
        MAT_QTY,   
        MAT_USE_QTY,
        (SELECT MAT_NM FROM material where MAT_CD=pf.MAT_CD) AS MAT_NM,
        UNIT
    FROM
      proc_mat pf
    where pf.INST_CD = '${values.INST_CD}' and pf.PROC_FLOW_CD = '${values.PROC_FLOW_CD}'
    `;
    return sql;
}

//커스텀된 공정흐름별 자재사용량 등록
const instMatUpdate =
`UPDATE proc_mat 
SET MAT_USE_QTY=? 
WHERE INST_MAT_CD = ? `;

//생산공정 시작/종료
const processStart = 
`UPDATE prod_result 
SET ? 
WHERE PROD_RESULT_CD = ? `;


/* 자재출고 [S] */

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
    sql += `(CONCAT('MOD', LPAD(nextval(mat_out_seq), 3,'0')), 
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

/* 자재출고 [E] */


 //공정시작 시 계획서/지시서 상태변경
 const statusChange = (values) => {
let sql = `
  UPDATE 
    prod_inst a INNER JOIN prod_plan b ON a.PROD_PLAN_CD=b.PROD_PLAN_CD
    SET b.STATUS='${values.STATUS}'
    WHERE INST_CD = '${values.no}'
`;
return sql;
 }

module.exports = {
    planSelect,
    planSearch,
    planSeq,
    planInsert,
    planUpdate,
    planDtlInsert,
    planDtlDelete,
    planDelete,
    planDtlList,

    instList,
    instDtlList,
    instInfo,
    instSeq,
    instInsert,
    instDelete,
    instDtlSeq,
    instDtlInsert,
    instFlowSeq,
    instFlowInsert,
    instCusFlow,
    instCusEqu,

    instProcList,
    instProcMtList,
    instMatSeq,
    instMatInsert,
    instMatUpdate,

    processStart,
    resultInfo,
    matLotSearch,
    matLotInsert,
    matLotUpdate,
    statusChange
}