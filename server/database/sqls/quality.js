// 검사항목 (QUALITY_TEST)
const testList = `
  SELECT  test_cd, 
		      test_nm, 
          (SELECT comm_dtl_note FROM common_detail WHERE comm_dtl_cd = test_metd) test_metd, 
          test_dtl, 
          pass_min, 
          pass_max, 
          (SELECT comm_dtl_note FROM common_detail WHERE comm_dtl_cd = pass_ispercent) pass_ispercent,
          (SELECT comm_dtl_note FROM common_detail WHERE comm_dtl_cd = target_type) target_type,
          (SELECT comm_dtl_note FROM common_detail WHERE comm_dtl_cd = status) status,
          create_dt
  FROM    quality_test
  WHERE   ?
  ORDER   BY test_nm, create_dt DESC
`;


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