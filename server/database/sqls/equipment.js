/* -----------설비------------*/

//상태전체조회
const eqStatList = `SELECT * FROM equipment`;

//정보전체조회
const eqAllList = `SELECT * FROM equipment`;

//단건조회
const equipInfo = `SELECT (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = eqp_type) eqp_type, 
                          eqp_nm,
                          model,
                          pur_dt,
                          pur_act,
                          mfg_act,
                          insp_cycle,
                          repl_cycle,
                          id,
                          opt_temp,
                          opt_humid,
                          opt_rpm,
                          opt_speed,
                          opt_power,
                          uph,
                          (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = status) STATUS,
                          (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = is_use) is_use

FROM equipment
WHERE eqp_cd = ?
`;

//등록
const eqInsert = `INSERT INTO equipment 
SET ? `;

//수정
const eqUpdate = `UPDATE equipment 
SET ? 
WHERE EQP_CD = ?`;

module.exports = {
  eqStatList,
  eqAllList,
  equipInfo,
  eqInsert,
  eqUpdate,
};
