//전체 제품조회
const prdList = 
`SELECT * FROM PRODUCT WHERE `


//bom 리스트
const bomlist = 
`SELECT * FROM BOM WHERE PRD_CD = ?`
//bom등록
const boardInsert = 
`INSERT INTO BOM (MAT_CD, PRD_CD, USAGE, UNIT)
VALUES(?,?,?,?)`
module.exports = {bomlist};
