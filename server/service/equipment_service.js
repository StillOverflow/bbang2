const mariadb = require('../database/mapper.js');

/*--------------설비-------------*/

// 상태전체조회
const findStatEq = async () => {
  let list = await mariadb.query('eqStatList');
  return list;
};

// 설비전체조회
const findAllEq = async () => {
  let list = await mariadb.query('eqAllList');
  return list;
};

// 필터링된 설비 정보 조회
const eqAllListSearch = async (values) => {
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
//설비 점검 전체 조회
const findInspEq = async () => {
  let list = await mariadb.query('eqInspList');
  return list;
};

//설비 점검 단건 조회
const findInspEquipNo = async (no) => {
  let list = await mariadb.query('equipInspNo', no);

  let info = list[0];
  return info;
};


module.exports = {
  findStatEq,
  findAllEq,
  findEquipNo,
  insertEq,
  updateEq,
  findInspEq,
  findInspEquipNo,
  eqAllListSearch
};
