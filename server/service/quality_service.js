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

// - 헤더 & 디테일 삽입
// 트랜잭션 미적용 버전
// const stdInsert = async (values) => { 
//     let sample = values[0];
//     let arr = [
//         sample.target_type,
//         sample.target_cd
//     ];
//     let dtl_res = await mariadb.query('stdDtlInsert', values); // 배열 그대로 넣기
//     if(header_res.affectedRows > 0 & dtl_res.affectedRows > 0){
//         return {"result" : "success"};
//     } else {
//         return {"result" : "fail"};
//     }
// };

// 트랜잭션 적용 버전
const stdInsert = async (values) => {
    return await mariadb.transOpen( async () => {
        // 헤더 시퀀스 nextval 얻기
        let seq_res = await mariadb.transQuery('stdSeq');
        let mySeq = seq_res[0].seq;
        
        // 헤더 삽입
        let header = values[0]; // 공통되는 부분은 헤더값으로 빼기
        let arr = [
            mySeq,
            header.target_type,
            header.target_cd
        ];
        let header_res = await mariadb.transQuery('stdInsert', arr);

        // 디테일 삽입
        values.forEach((val) => { // 헤더 시퀀스값 추가
            val.qu_std_cd = mySeq;
        });
        let dtl_res = await mariadb.transQuery('stdDtlInsert', values);
        
        if(header_res.affectedRows > 0 & dtl_res.affectedRows > 0){
            await mariadb.commit();
        }
    });
};


module.exports = {
    getYetList,
    getMyList,
    findTestList,
    stdInsert
}