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
    delete eqInfo.is_prod;

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
// const insertInspEq = async (inspData) => {
//   let new_insp_log_cd = (await mariadb.query('getInspCd'))[0].insp_log_cd;
//   inspData['insp_log_cd'] = new_insp_log_cd;

//   let result = await mariadb.query('eqInspInsert', inspData);
//   if (result.affectedRows > 0) {
//     return { insp_log_cd: new_insp_log_cd };
//   } else {
//     return {};
//   }
// };


// 점검 등록 (트랜잭션 적용 버전)
const insertInspEq = async (inspData) => {
  let result = await mariadb.transOpen(async () => {

    let new_insp_log_cd = (await mariadb.transQuery('getInspCd'))[0].insp_log_cd;

    let inspDataArr = [
      new_insp_log_cd,
      inspData.eqp_cd,
      inspData.start_time,
      inspData.end_time,
      inspData.insp_reason,
      inspData.insp_result,
      inspData.note,
      inspData.id,

      inspData.end_time ? inspData.end_time.substr(0, 10) : null, // last_insp_dt
      inspData.end_time, // next_insp_dt 계산용 (서브쿼리 안에 들어갈 값)
      inspData.eqp_cd
    ];

    let inspResult = await mariadb.transQuery('eqInspInsert', inspDataArr);
    let inserted = await mariadb.transQuery('eqInspInfo', inspData.eqp_cd); // 위에서 epInspInsert 한 최신값

    let eqpData = { last_insp_dt: inspData.end_time, next_insp_dt: inserted[0].next_insp_dt };
    let eqpResult = await mariadb.transQuery('eqUpdate', [eqpData, inspData.eqp_cd]);

    let new_downtime_cd = (await mariadb.query('getDownCd'))[0].downtime_cd;
    let dtData = { downtime_cd: new_downtime_cd, eqp_cd: inspData.eqp_cd, start_time: inspData.start_time, id: inspData.id };
    if (inspData.insp_result == 'X02') { // 판정결과 적합일 때만 비가동종료시간 입력되도록 함.
      dtData.end_time = inspData.end_time;
    }
    dtData.downtime_reason = inspData.insp_reason == 'V02' ? 'U01' : 'U02';

    let dtResult = await mariadb.transQuery('eqDownInsert', dtData);

    if (inspResult.affectedRows > 0 && eqpResult.affectedRows > 0 && dtResult.affectedRows > 0) { // 모두 성공했는지 판단
      await mariadb.commit();
      return { insp_log_cd: new_insp_log_cd };
    } else {
      await mariadb.rollback();
      return {};
    }
  });

  return result;
};

//점검 수정
// const updateInspEq = async (inspData) => {
//   try {
//     const inspLogCd = inspData.insp_log_cd; // 점검 코드 추출
//     delete inspData.insp_log_cd; // WHERE 조건에 사용되므로 객체에서 제거

//     // 현재 시간 추가 (MySQL 형식으로 변환)
//     const now = new Date();
//     inspData.update_dt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:MM:SS"

//     // SQL 실행
//     const result = await mariadb.query('eqInspUpdate', [inspData, inspLogCd]);

//     if (result && result.affectedRows > 0) {
//       return { success: true, message: '점검 정보 수정 성공' };
//     } else {
//       return { success: false, message: '수정할 데이터가 없습니다.' };
//     }
//   } catch (err) {
//     console.error('DB 수정 에러:', err);
//     throw new Error('데이터베이스 수정 실패');
//   }
// };


const updateInspEq = async (inspData) => {
  let result = await mariadb.transOpen(async () => {

    const inspLogCd = inspData.insp_log_cd; // 점검 코드 추출
    delete inspData.insp_log_cd; // WHERE 조건에 사용되므로 객체에서 제거

    // 현재 시간 추가 (MySQL 형식으로 변환)
    const now = new Date();
    inspData.update_dt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:MM:SS"
    inspData.last_insp_dt = inspData.end_time;
    let updateData = [inspLogCd];

    if (inspData.end_time) { // end_time 있을 때는 쿼리가 달라짐
      updateData = [inspData.end_time, inspData.eqp_cd, inspLogCd];
    }

    // SQL 실행
    const result = await mariadb.transQuery('eqInspUpdate', [inspData, ...updateData]);

    let eqpResult = null;
    let dtResult = null;
    if (inspData.end_time) { // end_time이 있을 수도 있고 없을 수도 있으므로 있는 경우에만 아래 실행
      let updated = await mariadb.transQuery('eqInspInfo', inspData.eqp_cd); // 위에서 epInspInsert 한 최신값
      let eqpData = { last_insp_dt: inspData.end_time, next_insp_dt: updated[0].next_insp_dt };
      eqpResult = await mariadb.transQuery('eqUpdate', [eqpData, inspData.eqp_cd]);

      let downtime = await mariadb.transQuery('eqDownInfo', inspData.eqp_cd); // 기존에 점검기록 입력할 때 생성된 비가동기록코드 찾기
      let dtReason = inspData.insp_reason == 'V02' ? 'U01' : 'U02'; // 점검사유가 수정되었다면 반영
      let dtData = { id: inspData.id, downtime_reason: dtReason };
      if (inspData.insp_result == 'X02') { // 판정결과 적합일 때만 비가동종료시간 입력되도록 함.
        dtData.end_time = inspData.end_time;
      }
      dtResult = await mariadb.transQuery('eqDownUpdate', [dtData, downtime[0].downtime_cd]);
    }

    if ((!inspData.end_time && result.affectedRows > 0) ||
      (inspData.end_time && result.affectedRows > 0 && eqpResult.affectedRows > 0 && dtResult.affectedRows > 0)) { // 모두 성공했는지 판단
      await mariadb.commit();
      return { success: true, message: '점검 정보 수정 성공' };
    } else {
      await mariadb.rollback();
      return { success: false, message: '수정할 데이터가 없습니다.' };
    }
  });

  return result;
};

//설비 점검 전체 조회
const findInspEq = async (datas) => {
  try {
    let list = await mariadb.query('eqInspList', datas);
    return list;
  } catch (err) {
    console.error('설비 점검 DB 쿼리 실패:', err);
    throw err;
  }
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

    // SQL 실행
    const result = await mariadb.query('eqDownUpdate', [downData, downLogCd]);

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

//설비 비가동 전체 조회
const findDownEq = async (datas) => {
  try {
    let list = await mariadb.query('eqDownListSearch', datas);
    return list;
  } catch (err) {
    console.error('설비 비가동 DB 쿼리 실패:', err);
    throw err;
  }
};


//설비 비가동 전체 조회(설비별 최근 1건씩만)
const findDownEqOne = async (eqp_cd) => {
  let list = await mariadb.query('eqDownInfo', eqp_cd);
  return list[0];
};


/* ---------------------- 설비 수리 ----------------------- */

// 수리 등록
// const insertRepairEq = async (repairData) => {
//   let new_repair_cd = (await mariadb.query('getRepairCd'))[0].repair_cd;
//   repairData['repair_cd'] = new_repair_cd;

//   let result = await mariadb.query('eqRepairInsert', repairData);

//   if (result.affectedRows > 0) {
//     return { repair_cd: new_repair_cd };
//   } else {
//     return {};
//   }
// };


// 수리 등록 (트랜잭션 적용 버전)
const insertRepairEq = async (repairData) => {
  let result = await mariadb.transOpen(async () => {

    let new_repair_cd = (await mariadb.transQuery('getRepairCd'))[0].repair_cd;
    repairData.repair_cd = new_repair_cd;
    let repairResult = await mariadb.transQuery('eqRepairInsert', repairData);

    let new_downtime_cd = (await mariadb.query('getDownCd'))[0].downtime_cd;
    let dtData = { downtime_cd: new_downtime_cd, eqp_cd: repairData.eqp_cd, start_time: repairData.start_time, end_time: repairData.end_time, id: repairData.id };
    dtData['downtime_reason'] = 'U03';
    let dtResult = await mariadb.transQuery('eqDownInsert', dtData);

    if (repairResult.affectedRows > 0 && dtResult.affectedRows > 0) { // 모두 성공했는지 판단
      await mariadb.commit();
      return { repair_log_cd: new_repair_cd };
    } else {
      await mariadb.rollback();
      return {};
    }
  });

  return result;
};




//수리 수정
// const updateRepairEq = async (repairData) => {
//   try {
//     const repairLogCd = repairData.repair_cd; // 점검 코드 추출
//     delete repairData.repair_cd; // WHERE 조건에 사용되므로 객체에서 제거

//     // 현재 시간 추가 (MySQL 형식으로 변환)
//     const now = new Date();
//     repairData.update_dt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:MM:SS"

//     // SQL 실행
//     const result = await mariadb.query('eqRepairUpdate', [repairData, repairLogCd]);

//     if (result && result.affectedRows > 0) {
//       return { success: true, message: '수리 정보 수정 성공' };
//     } else {
//       return { success: false, message: '수정할 데이터가 없습니다.' };
//     }
//   } catch (err) {
//     throw new Error('데이터베이스 수정 실패');
//   }
// };


const updateRepairEq = async (repairData) => {
  let result = await mariadb.transOpen(async () => {

    const repairLogCd = repairData.repair_cd; // 점검 코드 추출
    delete repairData.repair_cd; // WHERE 조건에 사용되므로 객체에서 제거

    // 현재 시간 추가 (MySQL 형식으로 변환)
    const now = new Date();
    repairData.update_dt = now.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:MM:SS"

    // SQL 실행
    const rpResult = await mariadb.transQuery('eqRepairUpdate', [repairData, repairLogCd]);

    let dtResult = null;
    if (repairData.end_time) { // end_time이 있을 수도 있고 없을 수도 있으므로 있는 경우에만 아래 실행

      let downtime = await mariadb.transQuery('eqDownInfo', repairData.eqp_cd); // 기존에 점검기록 입력할 때 생성된 비가동기록코드 찾기
      dtResult = await mariadb.transQuery('eqDownUpdate', [{ end_time: repairData.end_time, id: repairData.id }, downtime[0].downtime_cd]);
    }

    if ((!repairData.end_time && rpResult.affectedRows > 0) ||
      (repairData.end_time && dtResult.affectedRows > 0 && rpResult.affectedRows > 0)) { // 모두 성공했는지 판단
      await mariadb.commit();
      return { success: true, message: '수리 정보 수정 성공' };
    } else {
      await mariadb.rollback();
      return { success: false, message: '수정할 데이터가 없습니다.' };
    }
  });

  return result;
};


//설비 수리 전체 조회
const findRepairEq = async (datas) => {
  try {
    let list = await mariadb.query('eqRepairListSearch', datas);
    return list;
  } catch (err) {
    console.error('설비 비가동 DB 쿼리 실패:', err);
    throw err;
  }
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
