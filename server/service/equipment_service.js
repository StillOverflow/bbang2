const mariadb = require('../database/mapper.js');

/*--------------설비-------------*/

// 상태전체조회
const findStatEq = async (datas) => {
  try {
    let list = await mariadb.query('eqStatList', datas);
    return list;
  } catch (err) {
    console.error('DB 쿼리 실패:', err);
    throw err;
  }
};

// 설비전체조회
const findAllEq = async () => {
  let list = await mariadb.query('eqAllList');
  return list;
};

// 필터링된 설비 정보 조회
const findFilteredEq = async (values) => {
  try {
    const list = await mariadb.query('eqAllListSearch', values);
    return list;
  } catch (err) {
    console.error("Error searching equips 실패: ", err);
    throw err;
  }
};

// 설비단건조회
const findEquipNo = async (no) => {
  let list = await mariadb.query('equipInfo', no); // 단건 조회 결과

  let info = list[0];
  return info;
};

// 등록
const insertEq = async (eqInfo) => {
  let new_eqp_cd = (await mariadb.query('getEqpCd'))[0].eqp_cd;
  eqInfo['eqp_cd'] = new_eqp_cd;

  let result = await mariadb.query('eqInsert', eqInfo);
  if (result.affectedRows > 0) {
    return { eqp_cd: new_eqp_cd };
  } else {
    return {};
  }
};

//수정

const updateEq = async (eqInfo) => {
  try {
    const eqpCd = eqInfo.eqp_cd; // 설비 코드 추출
    delete eqInfo.eqp_cd; // eqp_cd는 WHERE절에 사용되므로 제거

    // 현재 시간 추가 (MySQL 형식으로 변환)
    const now = new Date();
    eqInfo.update_dt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:MM:SS"


    // SQL 실행 (UPDATE ... SET ? WHERE eqp_cd = ?)
    let result = await mariadb.query('eqUpdate', [eqInfo, eqpCd]);

    if (result && result.affectedRows > 0) {
      return { success: true, message: '설비 정보 수정 성공' };
    } else {
      return { success: false, message: '수정할 데이터가 없습니다.' };
    }
  } catch (err) {
    console.error('DB 수정 에러:', err);
    throw new Error('데이터베이스 수정 실패');
  }
};

/* ---------------------- 설비 점검 ----------------------- */

// 점검 등록
const insertInspEq = async (inspData) => {
  let new_insp_log_cd = (await mariadb.query('getInspCd'))[0].insp_log_cd;
  inspData['insp_log_cd'] = new_insp_log_cd;

  let result = await mariadb.query('eqInspInsert', inspData);
  console.log(result);
  if (result.affectedRows > 0) {
    return { insp_log_cd: new_insp_log_cd };
  } else {
    return {};
  }
};

//점검 수정
const updateInspEq = async (inspData) => {
  try {
    const inspLogCd = inspData.insp_log_cd; // 점검 코드 추출
    delete inspData.insp_log_cd; // WHERE 조건에 사용되므로 객체에서 제거

    // 현재 시간 추가 (MySQL 형식으로 변환)
    const now = new Date();
    inspData.update_dt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:MM:SS"


    console.log('수정 요청 데이터:', inspData, 'insp_log_cd:', inspLogCd);

    // SQL 실행
    const result = await mariadb.query('eqInspUpdate', [inspData, inspLogCd]);

    console.log('SQL 실행 결과:', result);

    if (result && result.affectedRows > 0) {
      return { success: true, message: '점검 정보 수정 성공' };
    } else {
      return { success: false, message: '수정할 데이터가 없습니다.' };
    }
  } catch (err) {
    console.error('DB 수정 에러:', err);
    throw new Error('데이터베이스 수정 실패');
  }
};

//설비 점검 전체 조회
const findInspEq = async () => {
  let list = await mariadb.query('eqInspList');
  return list;
};

//설비 점검 전체 조회(설비별 최근 1건씩만)
const findInspEqOne = async (eqp_cd) => {
  let list = await mariadb.query('eqInspInfo', eqp_cd);
  return list[0];
};

/* ---------------------- 설비 비가동 ----------------------- */

// 비가동 등록
const insertDownEq = async (downData) => {
  let new_downtime_cd = (await mariadb.query('getDownCd'))[0].downtime_cd;
  downData['downtime_cd'] = new_downtime_cd;

  let result = await mariadb.query('eqDownInsert', downData);
  console.log(result);
  if (result.affectedRows > 0) {
    return { downtime_cd: new_downtime_cd };
  } else {
    return {};
  }
};


//비가동 수정
const updateDownEq = async (downData) => {
  try {
    const downLogCd = downData.downtime_cd; // 점검 코드 추출
    delete downData.downtime_cd; // WHERE 조건에 사용되므로 객체에서 제거

    // 현재 시간 추가 (MySQL 형식으로 변환)
    const now = new Date();
    downData.update_dt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:MM:SS"


    console.log('수정 요청 데이터:', downData, 'downtime_cd:', downLogCd);

    // SQL 실행
    const result = await mariadb.query('eqDownUpdate', [downData, downLogCd]);

    console.log('SQL 실행 결과:', result);

    if (result && result.affectedRows > 0) {
      return { success: true, message: '비가동 정보 수정 성공' };
    } else {
      return { success: false, message: '수정할 데이터가 없습니다.' };
    }
  } catch (err) {
    console.error('DB 수정 에러:', err);
    throw new Error('데이터베이스 수정 실패');
  }
};

//설비 점검 전체 조회
const findDownEq = async () => {
  let list = await mariadb.query('eqDownList');
  return list;
};

//설비 점검 전체 조회(설비별 최근 1건씩만)
const findDownEqOne = async (eqp_cd) => {
  let list = await mariadb.query('eqDownInfo', eqp_cd);
  return list[0];
};


/* ---------------------- 설비 수리 ----------------------- */

// 수리 등록
const insertRepairEq = async (repairData) => {
  let new_repair_cd = (await mariadb.query('getRepairCd'))[0].repair_cd;
  repairData['repair_cd'] = new_repair_cd;

  let result = await mariadb.query('eqRepairInsert', repairData);
  console.log(result);
  if (result.affectedRows > 0) {
    return { repair_cd: new_repair_cd };
  } else {
    return {};
  }
};


//수리 수정
const updateRepairEq = async (repairData) => {
  try {
    const repairLogCd = repairData.repair_cd; // 점검 코드 추출
    delete repairData.repair_cd; // WHERE 조건에 사용되므로 객체에서 제거

    // 현재 시간 추가 (MySQL 형식으로 변환)
    const now = new Date();
    repairData.update_dt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:MM:SS"

    console.log('수정 요청 데이터:', repairData, 'repair_cd:', repairLogCd);

    // SQL 실행
    const result = await mariadb.query('eqRepairUpdate', [repairData, repairLogCd]);

    console.log('SQL 실행 결과:', result);

    if (result && result.affectedRows > 0) {
      return { success: true, message: '수리 정보 수정 성공' };
    } else {
      return { success: false, message: '수정할 데이터가 없습니다.' };
    }
  } catch (err) {
    console.error('DB 수정 에러:', err);
    throw new Error('데이터베이스 수정 실패');
  }
};

//설비 수리 전체 조회
const findRepairEq = async () => {
  let list = await mariadb.query('eqRepairList');
  return list;
};

//설비 수리 전체 조회(설비별 최근 1건씩만)
const findRepairEqOne = async (eqp_cd) => {
  let list = await mariadb.query('eqRepairInfo', eqp_cd);
  return list[0];
};


module.exports = {
  findStatEq,
  findAllEq,
  findEquipNo,
  insertEq,
  updateEq,
  findInspEq,
  findFilteredEq,
  insertInspEq,
  updateInspEq,
  findInspEqOne,
  insertDownEq,
  updateDownEq,
  findDownEq,
  findDownEqOne,
  insertRepairEq,
  updateRepairEq,
  findRepairEq,
  findRepairEqOne,
};
