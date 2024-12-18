/* -----------설비------------*/

//상태전체조회
const eqStatList = `SELECT * FROM equipment`;

//정보전체조회
const eqAllList = `SELECT eqp_cd,
                          eqp_type,
                          eqp_nm,
                          model,
                          pur_dt,
                          pur_act,
                          mfg_act,
                          insp_cycle,
                          repl_cycle,
                          status,
                          id,
                          is_use,
                          opt_temp,
                          opt_humid,
                          opt_rpm,
                          opt_speed,
                          opt_power,
                          last_insp_dt,
                          next_insp_dt,
                          uph,
                          create_dt,
                          update_dt,
                          note 
FROM equipment`;

//정보단건조회
const equipInfo = `SELECT eqp_cd,
                          eqp_type, 
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
                          is_use,
                          img_path
FROM equipment
WHERE eqp_cd = ?
`;

//등록전 마지막 설비코드 찾기+1
const getEqpCd = `
SELECT CONCAT('EQP', LPAD(IFNULL(MAX(SUBSTR(e.eqp_cd, -3)) + 1,1), 3,'0')) AS eqp_cd FROM equipment e`;

//설비등록
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
  getEqpCd,
};
