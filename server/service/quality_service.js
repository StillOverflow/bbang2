const mariadb = require('../database/mapper.js');

// 검사항목
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
    findTestList,
    stdInsert
}