// 검사항목 (QUALITY_TEST)
// 특정 대상에 미적용 목록 조회
const yetList = `
  SELECT test_cd, 
         fn_get_codename(test_metd) test_metd, 
         test_nm, 
         test_dtl,
         target_type
  FROM   quality_test
  WHERE  test_cd NOT IN (
                          SELECT test_cd
                          FROM   quality_standard_detail
                          WHERE  qu_std_cd = (
                                              SELECT qu_std_cd
                                              FROM   quality_standard
                                              WHERE  target_cd = ?
                                              ORDER  BY qu_std_cd DESC LIMIT 1
                                            )
                          ) `;

// 특정 대상에 현재 적용중인 목록 조회
const getMyList = () => {
  let myListSql = yetList.replace('NOT IN', 'IN');
  return myListSql;
};

// 실험용!!!! 검색조건을 포함한 조회
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


// 품질기준 (QUALITY_STANDARD)
// 다음 번호 조회 (시퀀스 미사용)
const stdSeq = `
  SELECT CONCAT('QS', LPAD(  IFNULL(  MAX(SUBSTR(qu_std_cd, -3)), 0) + 1  , 3, '0'  )  ) seq
  FROM   quality_standard `;

// 헤더 입력
const stdInsert = `
  INSERT INTO quality_standard
    (qu_std_cd, target_type, target_cd)
  VALUES (?, ?, ?) `;

// 디테일 입력
const stdDtlInsert = (values) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT INTO quality_standard_detail
      (qu_std_dtl_cd, qu_std_cd, test_cd)
    VALUES `;

  values.forEach((obj) => {
    sql += `(CONCAT('QSD', LPAD(nextval(qual_std_dtl_seq), 3,'0')), '${obj.qu_std_cd}', '${obj.test_cd}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};


// 자재, 공정, 제품 전체 조회 (모달용)
const searchAll  = (valueObj) => {
  let nm = valueObj.nm;
  let cd = valueObj.cd;
  // 이름이나 카테고리(코드) 둘 중 하나 혹은 둘 다 검색조건으로 들어올 수 있음.
  return `
    (SELECT prd_cd, prd_nm nm, category
    FROM   product
    WHERE  create_dt IS NOT NULL -- 시작부에 당연한 조건을 줘서 AND만 추가 가능
      ${!nm ? "" : "AND  prd_nm LIKE '%" + nm + "%' "}
      ${!cd ? "" : "AND  category = '" + cd + "' " } )
    UNION
    (SELECT mat_cd, mat_nm nm, category
    FROM   material
    WHERE  create_dt IS NOT NULL
      ${!nm ? "" : "AND  mat_nm LIKE '%" + nm + "%' "}
      ${!cd ? "" : "AND  category = '" + cd + "' " } )
    UNION
    (SELECT proc_cd, proc_nm nm, eqp_type
    FROM   process
    WHERE  create_dt IS NOT NULL
      ${!nm ? "" : "AND  proc_nm LIKE '%" + nm + "%' "}
      ${!cd ? "" : "AND  proc_cd = '" + cd + "' " } )
  `;
};


module.exports = {
  yetList,
  getMyList,
  testList,
  stdSeq,
  stdInsert,
  stdDtlInsert,
  searchAll
}