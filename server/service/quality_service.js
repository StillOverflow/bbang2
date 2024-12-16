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
const stdInsert = async (obj) => { 
    let result = await mariadb.query('stdInsert', obj);
    if(result.affectedRows == 1){
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