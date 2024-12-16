// 정확히 특정 공통코드를 찾을 때
const findComm = `
  SELECT comm_dtl_nm
  FROM   common_detail
  WHERE  UPPER(comm_dtl_cd) = UPPER(?)
`;

// QQQ01 중 'QQQ'와 관련된 공통코드를 모두 찾을 때
const findCommList = `
  SELECT comm_dtl_nm, comm_dtl_cd
  FROM   common_detail
  WHERE  UPPER(comm_cd) = UPPER( ? )
  ORDER  BY comm_dtl_cd
`;

module.exports = {
  findComm,
  findCommList
};
