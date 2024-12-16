// 검사항목 (QUALITY_TEST)
const testList = (sc) => { // 매개변수로 검색조건을 유동적으로 받아 쿼리 반환
  let sql = `
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

  // 검색조건이 있을 경우 WHERE절 생성
  if(sc != null){
    let where = `WHERE `;

    console.log(Object.keys(sc));
    let scArr = Object.keys(sc);

    for(let i = 0; i < scArr.length; i++){
      where += `${scArr[i]} = ${sc[`${scArr[i]}`]} `;
      if(i != scArr.length - 1){ // 마지막 값이 아닌 경우 AND 생성
        where += `AND `;
      }
    }
    sql += where;
  }
  sql += `ORDER BY test_nm, create_dt DESC`; // 마지막에 정렬
  return sql;
};


// 품질기준 (QUALITY_STANDARD)
const stdInsert = `
  INSERT INTO quality_standard (
    (QU_STD_CD, TARGET_TYPE, TARGET_CD)
  SET ?
`;

module.exports = {
  testList,
  stdInsert
}