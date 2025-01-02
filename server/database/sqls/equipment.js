/* -----------설비------------*/

/* -----------설비 관리------------*/
//설비상태조회
const eqStatList = (datas) => {

  let sql = `SELECT 
    e.eqp_cd as eqp_cd,
    fn_get_codename(e.eqp_type) as eqp_type, 
    e.eqp_nm as eqp_nm,
    e.model as model,
    p.proc_cd as proc_cd,
    p.proc_nm as proc_nm,
    e.last_insp_dt AS last_insp_dt,
    e.id as id,
    fn_get_codename(e.status) as status,
    fn_get_codename(e.is_use) as is_use
FROM 
    equipment e
LEFT JOIN 
    prod_result pr ON e.eqp_cd = pr.eqp_cd
LEFT JOIN 
    process p ON pr.proc_cd = p.proc_cd`;

  const queryArr = [];

  // 설비상태조회 조건
  if (datas.eqp_type) queryArr.push(`e.eqp_type = UPPER('${datas.eqp_type}')`);
  if (datas.is_use) queryArr.push(`is_use = UPPER('${datas.is_use}')`);
  if (datas.status) queryArr.push(`e.status = UPPER('${datas.status}')`);

  if (queryArr.length > 0) {
    sql += ` WHERE ` + queryArr.join(' AND ');
  }

  sql += ` order by eqp_cd asc`; // 정렬

  return sql;

}
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
                      e.last_insp_dt as last_insp_dt, 
                      i.start_time as start_time,
                      i.insp_type as insp_type,
                      i.insp_reason as insp_reason,
                      i.insp_result as insp_result,
                      i.insp_action as insp_action,
                      i.note as note,
                      i.end_time as end_time,
                      e.id as id,
                      e.create_dt as create_dt,
                      e.update_dt as update_dt

FROM equipment e
      LEFT JOIN inspection_log i 
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
  last_insp_dt,
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

// 점검 등록 전 마지막 점검 코드 찾기 +1
const getInspCd = `
SELECT CONCAT('INS', LPAD(IFNULL(MAX(SUBSTR(i.INSP_LOG_CD, -3)) + 1, 1), 3, '0')) AS insp_log_cd FROM inspection_log i`;

//설비점검등록
const eqInspInsert = `INSERT INTO inspection_log
SET ? `;

//설비점검수정
const eqInspUpdate = `UPDATE inspection_log
SET ?
  WHERE insp_log_cd = ? `;

//설비점검조회
const eqInspList = ` SELECT   
  i.insp_log_cd as insp_log_cd,
  e.eqp_cd as eqp_cd,
  fn_get_codename(e.eqp_type) as eqp_type,
  e.eqp_nm as eqp_nm,
  e.model as model,
  e.insp_cycle as insp_cycle,
  e.img_path as img_path,
  e.last_insp_dt as last_insp_dt,
  i.start_time as start_time,
  fn_get_codename(i.insp_type) as insp_type,
  fn_get_codename(i.insp_reason) as insp_reason,
  fn_get_codename(i.insp_result) as insp_result,
  i.insp_action as insp_action,
  i.note as note,
  i.end_time as end_time,
  i.id as id,
  i.create_dt as create_dt,
  i.update_dt as update_dt

FROM equipment e
LEFT JOIN inspection_log i ON e.eqp_cd = i.eqp_cd
ORDER BY i.create_dt DESC
`;

//설비점검조회(설비별 최신1건씩만)
const eqInspListOne = `SELECT 
  i.insp_log_cd as insp_log_cd,
  e.eqp_cd as eqp_cd,
  e.eqp_type as eqp_type,
  e.eqp_nm as eqp_nm,
  e.model as model,
  e.insp_cycle as insp_cycle,
  e.img_path as img_path,
  e.last_insp_dt as last_insp_dt,
  i.start_time as start_time,
  i.insp_type as insp_type,
  i.insp_reason as insp_reason,
  i.insp_result as insp_result,
  i.insp_action as insp_action,
  i.note as note,
  i.end_time as end_time,
  i.id as id,
  i.create_dt as create_dt,
  i.update_dt as update_dt
FROM equipment e
LEFT JOIN inspection_log i 
  ON e.eqp_cd = i.eqp_cd
  AND i.start_time = (
    SELECT MAX(start_time) 
    FROM inspection_log 
    WHERE eqp_cd = e.eqp_cd
  )
    WHERE e.eqp_cd = ?
ORDER BY e.eqp_cd, i.start_time DESC`;

//설비점검 단건조회
const eqInspInfo = `SELECT 
  i.insp_log_cd,
  e.eqp_cd,
  e.eqp_type AS eqp_type,
  e.eqp_nm,
  e.model,
  e.insp_cycle,
  e.img_path,
  e.last_insp_dt,
  i.start_time,
  i.insp_type AS insp_type,
  i.insp_reason AS insp_reason,
  i.insp_result AS insp_result,
  i.insp_action,
  i.note,
  i.end_time,
  i.id,
  i.create_dt,
  i.update_dt
FROM equipment e
LEFT JOIN inspection_log i 
  ON e.eqp_cd = i.eqp_cd
  AND i.start_time = (
    SELECT MAX(start_time) 
    FROM inspection_log 
    WHERE eqp_cd = e.eqp_cd
  )
WHERE e.eqp_cd = ?
ORDER BY e.eqp_cd, i.start_time DESC
limit 1
  `;

//설비 점검 조회(필터링 적용) //아직 조회페이지 전이라 검증 필요
const eqInstListSearch = (searchObj) => {
  let query = ` SELECT  e.eqp_cd as eqp_cd,
                      fn_get_codename(e.eqp_type) as eqp_type,
                      e.eqp_nm as eqp_nm,
                      e.insp_cycle as insp_cycle,
                      e.img_path as img_path,
                      fn_get_codename(e.is_use) as is_use,
                      e.model as model,
                      fn_get_codename(e.status) as status,
                      e.last_insp_dt as last_insp_dt, 
                      i.start_time as start_time,
                      i.insp_type as insp_type,
                      i.insp_reason as insp_reason,
                      i.insp_result as insp_result,
                      i.insp_action as insp_action,
                      i.note as note,
                      i.end_time as end_time,
                      e.id as id,
                      e.create_dt as create_dt,
                      e.update_dt as update_dt

FROM equipment e
      LEFT JOIN inspection_log i 
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


/* -----------설비 비가동 관리------------*/

// 비가동 등록 전 마지막 비가동 코드 찾기 +1
const getDownCd = `
SELECT CONCAT('DTM', LPAD(IFNULL(MAX(SUBSTR(d.DOWNTIME_CD, -3)) + 1, 1), 3, '0')) AS downtime_cd FROM downtime_log d`;

//설비 비가동 등록
const eqDownInsert = `INSERT INTO downtime_log
SET ? `;

//설비 비가동 수정
const eqDownUpdate = `UPDATE downtime_log
SET ?
  WHERE downtime_cd = ? `;

//설비 비가동 조회
const eqDownList = ` SELECT   
  d.downtime_cd as downtime_cd,
  e.eqp_cd as eqp_cd,
  fn_get_codename(e.eqp_type) as eqp_type,
  e.eqp_nm as eqp_nm,
  e.model as model,
  d.start_time as start_time,
  d.end_time as end_time,
  fn_get_codename(d.status) as status,
  fn_get_codename(d.downtime_reason) as downtime_reason,
  d.id as id,
  d.create_dt as create_dt,
  d.update_dt as update_dt,
  d.note as note

FROM equipment e
LEFT JOIN downtime_log d ON e.eqp_cd = d.eqp_cd
ORDER BY d.create_dt DESC
`;

//설비 비가동 조회(설비별 최신1건씩만)
const eqDownListOne = `SELECT 
  d.downtime_cd as downtime_cd,
  e.eqp_cd as eqp_cd,
  fn_get_codename(e.eqp_type) as eqp_type,
  e.eqp_nm as eqp_nm,
  e.model as model,
  d.start_time as start_time,
  d.end_time as end_time,
  fn_get_codename(d.status) as status,
  fn_get_codename(d.downtime_reason) as downtime_reason,
  d.id as id,
  d.create_dt as create_dt,
  d.update_dt as update_dt,
  d.note as note

FROM equipment e
LEFT JOIN downtime_log d 
  ON e.eqp_cd = d.eqp_cd
  AND d.start_time = (
    SELECT MAX(start_time) 
    FROM downtime_log 
    WHERE eqp_cd = e.eqp_cd
  )
ORDER BY e.eqp_cd, d.start_time DESC`;

//설비 비가동 단건조회
const eqDownInfo = `SELECT 
  d.downtime_cd as downtime_cd,
  e.eqp_cd as eqp_cd,
  e.eqp_type as eqp_type,
  e.eqp_nm as eqp_nm,
  e.model as model,
  d.start_time as start_time,
  d.end_time as end_time,
  d.status as status,
  d.downtime_reason as downtime_reason,
  d.id as id,
  d.create_dt as create_dt,
  d.update_dt as update_dt,
  d.note as note

FROM equipment e
LEFT JOIN downtime_log d 
  ON e.eqp_cd = d.eqp_cd
  AND d.start_time = (
    SELECT MAX(start_time) 
    FROM downtime_log 
    WHERE eqp_cd = e.eqp_cd
  )
    WHERE e.eqp_cd = ?
ORDER BY e.eqp_cd, d.start_time DESC
limit 1
  `;


/* -----------설비 수리 관리------------*/

// 수리 등록 전 마지막 수리 코드 찾기 +1
const getRepairCd = `
SELECT CONCAT('REP', LPAD(IFNULL(MAX(SUBSTR(d.REPAIR_CD, -3)) + 1, 1), 3, '0')) AS repair_cd FROM repair_log d`;

//설비 수리 등록
const eqRepairInsert = `INSERT INTO repair_log
SET ? `;

//설비 수리 수정
const eqRepairUpdate = `UPDATE repair_log
SET ?
  WHERE repair_cd = ? `;

//설비 수리 조회
const eqRepairList = ` SELECT   
  r.repair_cd as repair_cd,
  e.eqp_cd as eqp_cd,
  fn_get_codename(e.eqp_type) as eqp_type,
  e.eqp_nm as eqp_nm,
  e.model as model,
  r.start_time as start_time,
  r.end_time as end_time,
  r.repair_parts as repair_parts,
  fn_get_codename(r.repair_reason) as repair_reason,
  r.id as id,
  r.create_dt as create_dt,
  r.update_dt as update_dt,
  r.note as note

FROM equipment e
LEFT JOIN repair_log r ON e.eqp_cd = r.eqp_cd
ORDER BY r.create_dt DESC
`;

//설비 수리 조회(설비별 최신1건씩만)
const eqRepairListOne = `SELECT 
  r.repair_cd as repair_cd,
  e.eqp_cd as eqp_cd,
  fn_get_codename(e.eqp_type) as eqp_type,
  e.eqp_nm as eqp_nm,
  e.model as model,
  r.start_time as start_time,
  r.end_time as end_time,
  r.repair_parts as repair_parts,
  fn_get_codename(r.repair_reason) as repair_reason,
  r.id as id,
  r.create_dt as create_dt,
  r.update_dt as update_dt,
  r.note as note

FROM equipment e
LEFT JOIN repair_log r 
  ON e.eqp_cd = r.eqp_cd
  AND r.start_time = (
    SELECT MAX(start_time) 
    FROM repair_log 
    WHERE eqp_cd = r.eqp_cd
  )
ORDER BY e.eqp_cd, r.start_time DESC`;

//설비 수리 단건조회
const eqRepairInfo = `SELECT 
  r.repair_cd as repair_cd,
  e.eqp_cd as eqp_cd,
  e.eqp_type as eqp_type,
  e.eqp_nm as eqp_nm,
  e.model as model,
  r.start_time as start_time,
  r.end_time as end_time,
  r.repair_parts as repair_parts,
  r.repair_reason as repair_reason,
  r.id as id,
  r.create_dt as create_dt,
  r.update_dt as update_dt,
  r.note as note

FROM equipment e
LEFT JOIN repair_log r 
  ON e.eqp_cd = r.eqp_cd
  AND r.start_time = (
    SELECT MAX(start_time) 
    FROM repair_log 
    WHERE eqp_cd = r.eqp_cd
  )
    WHERE e.eqp_cd = ?
ORDER BY e.eqp_cd, r.start_time DESC
limit 1
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
  eqInspInfo,
  getInspCd,
  eqInspInsert,
  eqInspUpdate,
  eqInspListOne,
  eqInstListSearch,
  getDownCd,
  eqDownInsert,
  eqDownUpdate,
  eqDownList,
  eqDownListOne,
  eqDownInfo,
  getRepairCd,
  eqRepairInsert,
  eqRepairUpdate,
  eqRepairList,
  eqRepairListOne,
  eqRepairInfo
};
