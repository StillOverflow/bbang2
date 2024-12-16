/* -----------설비------------*/

//상태전체조회
const equipmentList = `SELECT * FROM equipment`;

//정보전체조회
const equipStatList = `SELECT * FROM equipment`;

//등록
const equipInsert = `INSERT INTO equipment 
SET ? `;

//수정
const equipUpdate = `UPDATE equipment 
SET ? 
WHERE EQP_CD = ?`;

module.exports = {
  equipList,
  equipStatList,
  equipInsert,
  equipUpdate,
};
