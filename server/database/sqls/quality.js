// 검사항목 (QUALITY_TEST)

let selectTSql = `
  SELECT  test_cd, 
          test_nm, 
          (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = test_metd) test_metd, 
          test_dtl, 
          pass_min, 
          pass_max, 
          (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = pass_ispercent) pass_ispercent,
          (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = target_type) target_type,
          (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = status) status,
          create_dt
  FROM    quality_test 
  `;
// let selectTSql = ` // 전체 컬럼 조회
//   SELECT  test_cd, 
//           test_nm, 
//           (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = test_metd) test_metd, 
//           test_dtl, 
//           pass_min, 
//           pass_max, 
//           (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = pass_ispercent) pass_ispercent,
//           (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = target_type) target_type,
//           (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = status) status,
//           create_dt
//   FROM    quality_test 
//   `;

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
// 매개변수로 검색조건을 유동적으로 받아 쿼리 반환. 값이 없을 시 전체출력
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

const stdInsert = `
  INSERT INTO quality_standard (
    (QU_STD_CD, TARGET_TYPE, TARGET_CD)
  SET ?
`;

module.exports = {
  getYetList,
  getMyList,
  testList,
  stdInsert
}