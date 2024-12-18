// 검사항목 (QUALITY_TEST)

let selectTSql = `
  SELECT  test_cd, 
          test_nm, 
          (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = test_metd) test_metd, 
          test_dtl, 
          pass_min, 
          pass_max, 
          (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = pass_ispercent) pass_ispercent,
          target_type,
          status,
          create_dt
  FROM    quality_test 
  `;

const getYetList = () => { // 적용하지 않은 목록 조회
  let where = `
    WHERE   target_type = ?
      AND   test_cd NOT IN (SELECT d.test_cd
                            FROM   quality_standard_detail d JOIN quality_standard h
                                                              ON d.QU_STD_CD = h.QU_STD_CD
                            WHERE  h.target_cd = ?)`;
  return selectTSql + where;
};

const getMyList = () => { // 적용한 목록 조회
  let where = `
    WHERE   target_type = ?
      AND   test_cd IN (SELECT d.test_cd
                        FROM   quality_standard_detail d JOIN quality_standard h
                                                          ON d.QU_STD_CD = h.QU_STD_CD
                        WHERE  h.target_cd = ?)
  `;
  return selectTSql + where;
};

// 실험용!!!! 검색조건을 포함한 조회
// 매개변수로 검색조건을 유동적으로 받아 쿼리 생성. 값이 없을 시 전체출력
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
// 시퀀스 조회
const stdSeq = `
  SELECT CONCAT('QS', LPAD(nextval(qual_std_seq), 3,'0')) seq
  FROM   dual
`;

// 헤더 입력
const stdInsert = `
  INSERT INTO quality_standard
    (qu_std_cd, target_type, target_cd)
  VALUES (?, ?, ?)
`;

// 디테일 입력
const stdDtlInsert = (values) => { // 배열 형식으로 받아야 함.
  let sql = `
    INSERT INTO quality_standard_detail
      (qu_std_dtl_cd, qu_std_cd, test_cd)
    VALUES 
  `;

  values.forEach((obj) => {
    sql += `(CONCAT('QSD', LPAD(nextval(qual_std_dtl_seq), 3,'0')), '${obj.qu_std_cd}', '${obj.test_cd}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};


module.exports = {
  getYetList,
  getMyList,
  testList,
  stdSeq,
  stdInsert,
  stdDtlInsert
}