const mariadb = require('../database/mapper.js');

// 검사항목
// 미적용 검사항목 조회
const getYetList = async (values) => {
    let result = await mariadb.query('yetList', values);
    return result;
};

// 적용 검사항목 조회
const getMyList = async (values) => { 
    let result = await mariadb.query('getMyList', values);
    return result;
};

// 전체 검사항목 조회 (조건 받음, 실험용)
const findTestList = async (search) => { 
    let result = await mariadb.query('testList', search);
    return result;
};


// 품질기준
// 등록 (트랜잭션 적용)
const stdInsert = async (values) => {
    let result = await mariadb.transOpen( async () => {

        // 헤더 시퀀스 nextval 얻기
        let seq_res = await mariadb.transQuery('stdSeq');
        let headerSeq = seq_res[0].seq;
        
        // 헤더 삽입
        let header = values[0]; // 공통되는 부분은 헤더값으로 빼기
        let arr = [
            headerSeq,
            header.target_type,
            header.target_cd
        ];
        let header_res = await mariadb.transQuery('stdInsert', arr);

        // 디테일 삽입
        values.forEach((val) => { // 헤더 시퀀스값 추가
            val.qu_std_cd = headerSeq;
        });
        let dtl_res = await mariadb.transQuery('stdDtlInsert', values);
        
        if(header_res.affectedRows > 0 && dtl_res.affectedRows > 0){ // 모두 성공했는지 판단
            await mariadb.commit();
            return 'success';
        } else {
            await mariadb.rollback();
            return 'fail';
        }
    });
    
    return result;
};

// 자재, 공정, 제품 전체 조회 (모달용)
const searchAll = async (valueObj) => { 
    // nm => '소금빵', cate_type => null, cate => 'C01', type => 'P03'(제품) 형태로 들어옴.
    // 하나만 있을 수도, 전부 있을 수도 있으므로 null여부에 따라 동적 쿼리 생성
    let result = mariadb.query('searchAll', valueObj);
    return result;
};


// 품질검사결과
// 검사대기 내역 조회 (생산실적 테이블에서 공정완료&검사대기 상태인 내역을 가져옴.)
const getWaitList = async () => { 
    let result = mariadb.query('testWaitList');
    return result;
};

// 타입별 불량조회 (모달용)
const getDefList = async (valueObj) => { 
    let result = mariadb.query('defectList', valueObj);
    return result;
};

// 검사결과 등록 (트랜잭션 적용)
const testRecInsert = async (valueObj) => {
    let result = await mariadb.transOpen( async () => {

        // 헤더 시퀀스 nextval 얻기
        let seq_res = await mariadb.transQuery('testRecSeq');
        let headerSeq = seq_res[0].seq;
        
        let header = valueObj.header;
        let dtl = valueObj.dtl;
        // 헤더 삽입
        header.test_rec_cd = headerSeq;
        let header_res = await mariadb.transQuery('testRecInsert', header);

        // 디테일 삽입 (디테일 있을 수도 있고, 없을 수도 있음: 샘플링검사 유무에 따라 다름.)
        let dtl_res = null;

        if(dtl.length > 0){ // 디테일이 있는 경우
            dtl.forEach((val) => { // 헤더 시퀀스값 추가
                val.test_rec_cd = headerSeq;
            });
            dtl_res = await mariadb.transQuery('testRecDtlInsert', dtl);
        }
        
        // 생산실적의 검사상태 업데이트
        let update_res = await mariadb.transQuery('prodResultUpdate', [header.def_qty, header.pass_qty, header.refer_cd]);

        if((dtl_res != null && header_res.affectedRows > 0 && dtl_res.affectedRows > 0 && update_res.affectedRows > 0) ||
            (header_res.affectedRows > 0 && update_res.affectedRows > 0)) { // 디테일 있으면 다 성공했는지, 없으면 헤더 성공했는지 판단
            await mariadb.commit();
            return 'success';
        } else {
            await mariadb.rollback();
            return 'fail';
        }
    });
    
    return result;
};


// 불량 미처리 내역 조회
const getTestDefList = async () => {
    let result = await mariadb.query('testDefList');
    return result;
};

// 검사결과내역 조회
const getTestRecList = async (valueObj) => {
    let result = await mariadb.query('testRecList', valueObj);
    return result;
};

// 검사결과 상세내역 (샘플링검사의 측정값) 조회
const getTestDtl = async (value) => {
    let result = await mariadb.query('testRecDtlSelect', value);
    return result;
};


// 불량 처리
const updateDefStatus = async (values) => {
    let result = await mariadb.query('testRecDefUpdate', values);

    if(result.affectedRows > 0) return 'success';
    else return 'fail';
};



module.exports = {
    getYetList,
    getMyList,
    findTestList,

    stdInsert,
    searchAll,
    
    getWaitList,
    getDefList,
    testRecInsert,

    getTestDefList,
    getTestRecList,
    getTestDtl,

    updateDefStatus
}