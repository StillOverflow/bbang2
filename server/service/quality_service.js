const mariadb = require('../database/mapper.js');

// 검사항목
const getYetList = async (cd) => { // 적용하지 않은 목록 조회
    let result = await mariadb.query('getYetList', cd);
    return result;
};

const getMyList = async (cd) => { // 적용한 목록 조회
    let result = await mariadb.query('getMyList', cd);
    return result;
};

const findTestList = async (search) => { // 조건을 받아 목록 조회
    let result = await mariadb.query('testList', search);
    return result;
};


// 품질기준
const stdInsert = async (values) => { 
    let sample = values[0];
    let arr = [
        sample.qu_std_cd,
        sample.target_type,
        sample.target_cd
    ];

    let header_res = await mariadb.query('stdInsert', arr);
    let dtl_res = await mariadb.query('stdDtlInsert', values); // 배열 그대로 넣기
    if(header_res.affectedRows > 0 & dtl_res.affectedRows > 0){
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};


module.exports = {
    getYetList,
    getMyList,
    findTestList,
    stdInsert
}