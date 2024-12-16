// 정확히 특정 공통코드를 찾을 때
const findComm = `
  SELECT comm_dtl_nm
  FROM   common_detail
  WHERE  UPPER(comm_dtl_cd) = UPPER(?)
`;

// QQA01 중 'QQ'와 관련된 공통코드를 모두 찾을 때
const findCommList = `
  SELECT comm_dtl_nm, comm_dtl_cd
  FROM   common_detail
  WHERE  UPPER(comm_cd) = UPPER( ? )
  ORDER  BY comm_dtl_cd
`;

// select박스에 공통코드 list 뿌릴 때
const commList = `
SELECT comm_dtl_nm, comm_dtl_cd
FROM   common_detail
WHERE  UPPER(comm_cd) = UPPER( ? )
`;

module.exports = {
  findComm,
  findCommList,
  commList
};