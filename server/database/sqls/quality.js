// 검사항목 (QUALITY_TEST)
// 특정 대상에 미적용 검사항목 조회
const yetList = `
  SELECT test_cd, 
         fn_get_codename(test_metd) test_metd_nm, 
         test_metd,
         test_nm, 
         test_dtl,
         target_type,
         pass_min, -- 샘플링검사인 경우 합격기준이 있음.
         pass_max,
         pass_ispercent
  FROM   quality_test
  WHERE  target_type = ?
    AND  test_cd NOT IN (
                          SELECT test_cd
                          FROM   quality_standard_detail
                          WHERE  qu_std_cd = (
                                              SELECT qu_std_cd
                                              FROM   quality_standard
                                              WHERE  target_cd = ?
                                              ORDER  BY qu_std_cd DESC LIMIT 1
                                            )
                          ) 
  ORDER BY test_nm `;

// 특정 대상에 현재 적용중인 검사항목 조회
const getMyList = () => {
  let myListSql = yetList.replace('NOT IN', 'IN');
  return myListSql;
};

// 실험용!!!! 검색조건을 포함한 전체 검사항목 조회
// 매개변수로 검색조건을 유동적으로 받아 쿼리 생성. 값이 없을 시 전체출력
// 잘 작동하지만 완전일치만 검색 가능한 문제가 있음. (BETWEEN, LIKE 등 미적용)
const testList = (sc) => {
  let query = selectTSql;
  let scArr = Object.keys(sc);
  // 검색조건이 있을 경우 WHERE절 생성
  if(scArr.length != 0){
    let where = `WHERE `;
    for(let i = 0; i < scArr.length; i++){
      where += `${scArr[i]} = '${sc[scArr[i]]}' `;
      if(i != scArr.length - 1){ // 마지막 값이 아닌 경우 AND 생성
        where += `AND `;
      }
    }
    query += where;
  };

  query += `ORDER BY test_nm, create_dt DESC`; // 마지막에 정렬
  return query;
};


// 품질기준 (QUALITY_STANDARD) 등록
// 다음 번호 조회 (시퀀스 미사용)
const stdSeq = `
  SELECT CONCAT('QS', LPAD(  IFNULL(  MAX(SUBSTR(qu_std_cd, -3)), 0) + 1  , 3, '0'  )  ) seq
  FROM   quality_standard `;

// 헤더 입력
const stdInsert = `
  INSERT INTO quality_standard
    (qu_std_cd, 
     target_type, 
     target_cd)
  VALUES (?, ?, ?) `;

// 디테일 입력
const stdDtlInsert = (values) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT INTO quality_standard_detail
      (qu_std_dtl_cd, 
       qu_std_cd, 
       test_cd)
    VALUES `;

  values.forEach((obj) => {
    sql += `(CONCAT('QSD', LPAD(nextval(qual_std_dtl_seq), 3,'0')), '${obj.qu_std_cd}', '${obj.test_cd}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};

// 자재, 공정, 제품 전체 조회 (모달용)
const searchAll  = (valueObj) => {
  let type = valueObj.type;
  let cate_type = valueObj.cate_type; // 자재 구분(원자재/부자재/소모품..)
  let cate = valueObj.cate;
  let nm = valueObj.nm;
  
  // 이름이나 카테고리(코드) 둘 중 하나 혹은 둘 다 검색조건으로 들어올 수 있음.
  let prodQuery = `
    (SELECT '제품' type, 
             prd_cd cd, 
             prd_nm nm, 
             '완제품' cate_type, 
             fn_get_codename(category) category, 
             fn_quality_std_dt(prd_cd) std_date, 
            'I01' cate_type_cd, 
             category category_cd
       FROM  product
      WHERE  create_dt IS NOT NULL -- 당연한 조건 (AND 생성 위함)
        ${!cate ? "" : "AND  category = '" + cate + "' "}
        ${!nm ? "" : "AND  prd_nm LIKE '%" + nm + "%' "}
      ORDER  BY std_date, cd )
  `;

  let matQuery = `
    (SELECT '자재' type, 
             mat_cd cd, 
             mat_nm nm, 
             fn_get_codename(type) cate_type, 
             fn_get_codename(category) category, 
             fn_quality_std_dt(mat_cd) std_date, 
             type cate_type_cd, 
             category category_cd
       FROM  material
      WHERE  create_dt IS NOT NULL -- 당연한 조건 (AND 생성 위함)
        ${!cate ? "" : "AND  category = '" + cate + "' "} 
        ${!cate_type ? "" : "AND  type = '" + cate_type + "' "} 
        ${!nm ? "" : "AND  mat_nm LIKE '%" + nm + "%' "}
      ORDER  BY std_date, cd )
  `;

  let procQuery = `
      (SELECT '공정' type, 
               proc_cd cd, 
               proc_nm nm, 
               null cate_type, 
               null category, 
               fn_quality_std_dt(proc_cd) std_date, 
               null cate_type_cd, 
               null category_cd
        FROM   process
        WHERE  create_dt IS NOT NULL -- 당연한 조건 (AND 생성 위함)
          ${!nm ? "" : "AND  proc_nm LIKE '%" + nm + "%' "}
        ORDER  BY std_date, cd )
  `;

  if(!type){ // 타입 명시하지 않았으면 전체 조회 쿼리문을 반환
     let queryArr = [prodQuery, matQuery, procQuery];
     return queryArr.join(" UNION ");
  } else {
    switch(type){
      case 'P01' : return matQuery; break;
      case 'P02' : return procQuery; break;
      case 'P03' : return prodQuery; break;
    }
  }
};


// 품질검사결과 (QUALITY_TEST_RECORD)
// 검사대기 내역 조회 (생산실적 테이블에서 공정완료&검사대기 상태인 내역을 가져옴.)
///////////////////// ** 테스트용이라 쿼리가 달라질 수 있음에 유의.
const testWaitList = `
  SELECT prod_result_cd refer_cd, inst_cd,
         proc_cd, 
         fn_get_proc_nm(proc_cd) proc_nm,
         prd_cd target_cd, 
         fn_get_prd_nm(prd_cd) target_nm,
         prod_qty total_qty,
         CASE WHEN step = (SELECT COUNT(*) 
                           FROM   process_flow
                           WHERE  prd_cd = 'PR01') THEN 1
                                                   ELSE 0 END is_last, -- 마지막 공정인지 여부
         end_time -- 공정 완료시점 시간
  FROM   test_prod_result
  WHERE  STATUS = 'Z03'
  AND    que_status = 'A02'
`;

// 타입별 불량조회 (모달용)
const defectList = (valueObj) => { 
  // def_type 조건에 들어갈 값을 객체로 받음. (P01, P02, P03 : 자재, 공정중, 제품)
  // P02와 P03 검사는 동시에 처리하기에, 조건 두 개가 들어올 수도 있으므로 subType 필요.
  let type = valueObj.type;
  let subType = valueObj.subType;
  
  return `
    SELECT def_cd, 
           def_nm,
           def_type, 
           fn_get_codename(def_type) def_type_nm,
           def_detail, 
           create_dt, 
           note
    FROM   defect
    WHERE  def_type = '${type}'
       ${!subType ? "" : "OR  def_type = '" + subType + "' "}  -- 두 번째 값이 있을 시 함께 조회
    ORDER  BY def_type DESC, def_nm
  `;
}

// 검사결과 등록
// 다음 번호 조회 (시퀀스 미사용)
const testRecSeq = `
  SELECT CONCAT('QR', LPAD(  IFNULL(  MAX(SUBSTR(test_rec_cd, -3)), 0) + 1  , 3, '0'  )  ) seq
  FROM   quality_test_record `;

// 헤더 입력
// 입력컬럼: test_rec_cd, test_dt, refer_cd, target_type, target_cd, total_qty, test_qty, pass_qty, def_qty, id, def_cd, note
const testRecInsert = `
  INSERT INTO quality_test_record
  SET ?`;

// 디테일 입력 (샘플링검사인 경우 개별 측정값)
const testRecDtlInsert = (values) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT INTO quality_test_record_detail
      (test_rec_dtl_cd, 
       test_rec_cd, 
       test_cd, 
       test_value)
    VALUES `;

  values.forEach((obj) => {
    sql += `(CONCAT('QRD', LPAD(nextval(qual_rec_dtl_seq), 3,'0')), '${obj.test_rec_cd}',
            '${obj.test_cd}', '${obj.test_value}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};

// 검사결과 등록 시 해당 생산실적 내역의 검사상태 Y로 변경
const prodResultUpdate = `
  UPDATE test_prod_result
  SET    que_status = 'A01',
         def_qty = ?,
         pass_qty = ?
  WHERE  prod_result_cd = ?
`;


// 검사결과내역 조회+검색
const testRecList = (valueObj) => {
  console.log('받은값: ' + (valueObj.targetCd));
  let recCd = valueObj.recCd;

  let startDt = valueObj.startDt;
  let endDt = valueObj.endDt;

  let referCd = valueObj.referCd;
  let targetCd = valueObj.targetCd;
  let note = valueObj.note;

  let isDef = valueObj.isDef; // boolean
  let yetDefect = valueObj.yetDefect;
  let defNm = valueObj.defNm;
  let name = valueObj.name;

  // 쿼리에 동적으로 다중조건 생성
  return `
     SELECT r.test_rec_cd, 
            r.test_dt, 
            r.refer_cd,

            r.target_type,
            r.target_cd,
            NULLIF(fn_get_prd_nm(r.target_cd), fn_get_materialname(r.target_cd)) target_nm, -- 검사한 제품 or 자재코드
            r.proc_cd,
            fn_get_proc_nm(r.proc_cd) proc_nm, -- 제품인 경우 존재

            r.total_qty, 
            r.test_qty, 
            r.pass_qty, 
            r.def_qty, 

            r.id,
            fn_get_membername(r.id) name, 
            r.def_cd,
            d.def_nm,
            r.def_status,
            r.complete_id,
            fn_get_membername(r.complete_id) complete_name, 
            r.complete_dt, 
            r.note
     FROM   quality_test_record r LEFT OUTER JOIN defect d
                                               ON r.def_cd = d.def_cd
     WHERE  r.test_dt IS NOT NULL -- 당연한 조건 (AND 생성 위함)
       ${!recCd ? "" : "AND  r.test_rec_cd LIKE '%" + recCd + "%' "}
       ${!startDt ? "" : "AND  r.test_dt >= '" + startDt + "' "} -- '2024-12-26 17:00' 형식
       ${!endDt ? "" : "AND  r.test_dt <= '" + endDt + "' "}
       ${!referCd ? "" : "AND  r.refer_cd LIKE '%" + referCd + "%' "}

       ${!targetCd ? "" : "AND  (r.target_cd = '" + targetCd + "' OR r.proc_cd = '" + targetCd + "') "}
       ${!note ? "" : "AND  r.note LIKE '%" + note + "%' "}

       ${!defNm ? "" : "AND  d.def_nm LIKE '%" + defNm + "%' "}
       ${isDef == 'true' ? "AND  r.def_cd IS NOT NULL" : ""} -- 불량이 발생한 내역
       ${isDef == 'false' ? "AND  r.def_cd IS NULL" : ""} -- 불량이 발생하지 않은 내역
       ${!yetDefect ? "" : "AND r.def_cd IS NOT NULL AND r.def_status IS NULL"} -- 불량이 발생했지만 처리되지 않은 내역
    ${!name ? "" : "HAVING  name LIKE '%" + name + "%' OR complete_name LIKE '%" + name + "%' "} -- alias는 WHERE절 이후에 적용되므로, JOIN 시 HAVING에서 써야 함.
    ORDER BY r.def_status -- 불량 미처리 내역(null)이 최상단에 옴.
  `;
};

// 검사결과 상세내역 (샘플링검사의 측정값) 조회
const testRecDtlSelect = `
  SELECT d.test_rec_dtl_cd,
         r.test_rec_cd,
         d.test_cd,
         d.test_value
  FROM   quality_test_record_detail d JOIN quality_test_record r
                                        ON d.test_rec_cd = r.test_rec_cd
  WHERE  r.test_rec_cd = ?
`;

// 불량 처리
const testRecDefUpdate = `
  UPDATE quality_test_record
  SET    ?
  WHERE  test_rec_cd = ?
`;



module.exports = {
  yetList,
  getMyList,
  testList,

  stdSeq,
  stdInsert,
  stdDtlInsert,
  searchAll,

  testWaitList,
  defectList,
  testRecSeq,
  testRecInsert,
  testRecDtlInsert,
  prodResultUpdate,

  testRecList,
  testRecDtlSelect,

  testRecDefUpdate
}