/* -----------설비------------*/

//설비상태조회
const eqStatList = `SELECT * FROM equipment`;

//설비정보조회
const eqAllList = `SELECT e.eqp_cd,
                          e.eqp_type,
                          e.eqp_nm,
                          e.model,
                          e.pur_dt,
                          e.pur_act,
                          e.mfg_act,
                          e.insp_cycle,
                          e.repl_cycle,
                          e.status,
                          e.id,
                          e.is_use,
                          e.opt_temp,
                          e.opt_humid,
                          e.opt_rpm,
                          e.opt_speed,
                          e.opt_power,
                          e.last_insp_dt,
                          e.next_insp_dt,
                          e.uph,
                          e.create_dt,
                          e.update_dt,
                          e.note,
                          date(r.end_time) AS end_dt
FROM equipment e 
                          JOIN repair_log r
                          ON e.eqp_cd = r.eqp_cd`;

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
