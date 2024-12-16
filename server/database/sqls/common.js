// 정확히 특정 공통코드를 찾을 때
const findComm = `
  SELECT comm_dtl_nm
  FROM   common_detail
  WHERE  UPPER(comm_dtl_cd) = UPPER(?)
`;

// QQA01 중 'QQ'와 관련된 공통코드를 모두 찾을 때
const findCommList = `
  SELECT CONCAT(comm_cd , comm_dtl_cd) cd,
		     comm_dtl_nm nm
  FROM   common_detail
  WHERE  UPPER(comm_cd) = UPPER(?)
  ORDER  BY comm_dtl_cd
`;

module.exports = {
  findComm,
  findCommList
};
