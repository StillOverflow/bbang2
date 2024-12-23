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
const eqAllListSearch = (searchObj) => {
  let query = ` SELECT  e.eqp_cd as eqp_cd,
                      fn_get_codename(e.eqp_type) as eqp_type,
                      e.eqp_nm as eqp_nm,
                      e.insp_cycle as insp_cycle,
                      e.img_path as img_path,
                      fn_get_codename(e.is_use) as is_use,
                      e.model as model,
                      fn_get_codename(e.status) as status,
                      i.start_time as start_time,
                      i.insp_type as insp_type,
                      i.insp_reason as insp_reason,
                      i.insp_result as insp_result,
                      i.insp_action as insp_action,
                      i.note as note,
                      i.end_time as end_time,
                      i.id as id,
                      date(e.create_dt) as create_dt,
                      date(e.update_dt) as update_dt
FROM equipment e
      RIGHT JOIN inspection_log i 
              ON e.eqp_cd = i.eqp_cd
`;

  const conditions = [];

  //설비구분
  if (searchObj.eqp_type)
    conditions.push(`eqp_type = '${searchObj.eqp_type}'`);

  //사용유무(사용가능/사용불가)
  if (searchObj.is_use)
    conditions.push(`is_use = '${searchObj.is_use}'`);

  //설비상태(가동/비가동)
  if (searchObj.status)
    conditions.push(`status = '${searchObj.status}'`);

  // WHERE 절 조립
  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }
  // 쿼리 반환
  return query;
};


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
SELECT CONCAT('EQP', LPAD(IFNULL(MAX(SUBSTR(e.eqp_cd, -3)) + 1, 1), 3, '0')) AS eqp_cd FROM equipment e`;

//설비등록
const eqInsert = `INSERT INTO equipment
SET ? `;

//수정
const eqUpdate = `UPDATE equipment
SET ?
  WHERE EQP_CD = ? `;



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
WHERE i.eqp_cd = 'EQP010'
ORDER BY i.create_dt DESC
  `;

module.exports = {
  eqStatList,
  eqAllList,
  equipInfo,
  eqInsert,
  eqUpdate,
  getEqpCd,
  eqAllListSearch,
  eqInspList,
  equipInspInfo
};
