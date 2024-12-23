/* -----------설비------------*/

/* -----------설비 관리------------*/
//설비상태조회
const eqStatList = `SELECT * FROM equipment`;

//설비정보조회
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

//설비 정보 조회(필터링 적용)
const eqAllListFiltered = ` SELECT  e.eqp_cd,
                                    e.eqp_type,
                                    e.eqp_nm,
                                    e.model,
                                    e.pur_dt,
                                    e.pur_act,
                                    e.mfg_act,
                                    e.insp_cycle,
                                    e.status,
                                    e.id,
                                    e.is_use,
                                    e.opt_temp,
                                    e.opt_humid,
                                    e.opt_rpm,
                                    e.last_insp_dt,
                                    e.next_insp_dt,
                                    e.uph,
                                    e.create_dt,
                                    e.update_dt,
                                    e.note
FROM equipment e
LEFT JOIN repair_log r ON e.eqp_cd = r.eqp_cd
WHERE 1=1
{{FILTER}}
ORDER BY e.create_dt DESC
`;

// 필터 동적 생성
function generateFilters(filters) {
  const { eqp_type, is_use, status } = filters;
  let filterQuery = '';
  // Prepared Statement용 파라미터 배열
  // (리터럴 그대로 넣으면 SQL Injection 공격에 취약하다고 함)
  const queryParams = [];

  //설비구분 필터
  if (eqp_type) {
    filterQuery += `AND e.eqp_type = ? `;
  }

  //사용유무 필터
  if (is_use) {
    filterQuery += `AND e.is_use = ? `;
  }

  //설비상태 필터(가동/비가동)
  if (status) {
    filterQuery += `AND e.status = ? `;
  }

  return { filterQuery, queryParams };
}

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



/* -----------설비 점검 관리------------*/
//설비점검조회
const eqInspList = ` SELECT   e.eqp_cd,
                              e.eqp_type,
                              e.eqp_nm,
                              e.model,
                              e.insp_cycle,
                              e.img_path,
                              i.start_time,
                              i.insp_type,
                              i.insp_reason,
                              i.insp_result,
                              i.insp_action,
                              i.note,
                              i.end_time,
                              i.id,
                              i.create_dt,
                              i.update_dt
FROM equipment e
RIGHT JOIN inspection_log i ON e.eqp_cd = i.eqp_cd
ORDER BY i.create_dt DESC
`;

//설비점검 단건조회
const equipInspInfo = `SELECT   e.eqp_cd,
                              e.eqp_type,
                              e.eqp_nm,
                              e.model,
                              e.insp_cycle,
                              e.img_path,
                              i.start_time,
                              i.insp_type,
                              i.insp_reason,
                              i.insp_result,
                              i.insp_action,
                              i.note,
                              i.end_time,
                              i.id,
                              i.create_dt,
                              i.update_dt
FROM equipment e
RIGHT JOIN inspection_log i ON e.eqp_cd = i.eqp_cd
WHERE i.eqp_cd ='EQP010'
ORDER BY i.create_dt DESC
`;

module.exports = {
  eqStatList,
  eqAllList,
  equipInfo,
  eqInsert,
  eqUpdate,
  getEqpCd,
  eqAllListFiltered,
  eqInspList,
  equipInspInfo
};
