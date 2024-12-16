/* -----------설비------------*/

//상태전체조회
const eqStatList =
`SELECT * FROM equipment`;

//정보전체조회
const eqAllList =
`SELECT * FROM equipment`;

//등록
const eqInsert =
`INSERT INTO equipment 
SET ? `;

//수정
const eqUpdate =
`UPDATE equipment 
SET ? 
WHERE EQP_CD = ?`;


module.exports = {
  eqStatList,
  eqAllList,
  eqInsert,
  eqUpdate
};
