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

// 해당 품질기준에 속한 검사항목 조회 (검사결과목록에서 조회용)
const getStdTestList = async (values) => { 
    let result = await mariadb.query('stdTestList', values);
    return result;
};

// 전체 검사항목 조회+검색
const findTestList = async (valueObj) => { 
    let result = await mariadb.query('testList', valueObj);
    return result;
};

// 검사항목 수정(단건)
const updateTest = async (values) => { 
    let result = await mariadb.query('testUpdate', values);
    if(result.affectedRows > 0) return 'success';
    else return 'fail';
};

// 검사항목 수정(일괄)
const updateTestAll = async (values) => { 
    let result = await mariadb.transOpen( async () => {
        
        let successCnt = 0;
        for(let obj of values){ // 받은 값만큼 반복 실행 (** forEach 쓰면 await과 맞지 않음.)
            let result = await mariadb.transQuery('testUpdate', [obj.changeObj, obj.test_cd]);
            if(result.affectedRows > 0) successCnt++;
        };

        if(successCnt == values.length){ // 모두 성공했는지 판단
            await mariadb.commit();
            return 'success';
        } else {
            await mariadb.rollback();
            return 'fail';
        }
    });
    
    return result;
};

// 검사항목 삭제
const deleteTest = async (value) => { 
    let result = await mariadb.query('testDelete', value);
    if(result.affectedRows > 0) return 'success';
    else return 'fail';
};

// 검사항목 추가
const insertTest = async (valueObj) => { 
    // valueObj : {target_type: [], test_metd:..., test_nm:..., ...} 식으로 들어옴.
    let result = await mariadb.transOpen( async () => {
        
        let successCnt = 0;
        let targetTypes = valueObj.target_type;
        for(let type of targetTypes){ // 받은 값만큼 반복 실행 (** forEach 쓰면 await과 맞지 않음.)
            let newObj = {...valueObj};
            newObj.target_type = type;
            
            let result = await mariadb.transQuery('testInsert', newObj);
            if(result.affectedRows > 0) successCnt++;
        };

        if(successCnt == targetTypes.length){ // 모두 성공했는지 판단
            await mariadb.commit();
            let inserted = await mariadb.query('testList', {testNm: valueObj.test_nm, testDtl: valueObj.test_dtl}); // 성공하면 입력된 거 조회해옴
            return inserted;
        } else {
            await mariadb.rollback();
            return 'fail';
        }
    });
    
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
// 제품 검사대기 내역 조회 (생산실적 테이블에서 공정완료&검사대기 상태인 내역을 가져옴.)
const getWaitPrdList = async () => { 
    let result = mariadb.query('testWaitPrdList');
    return result;
};

// 자재 검사대기 내역 조회
const getWaitMatList = async (value) => { 
    let result = mariadb.query('testWaitMatList', value);
    return result;
};

// 자재 미입고 거래처조회 (모달용)
const getActList = async () => { 
    let result = mariadb.query('actList');
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
        let instCd = valueObj.inst_cd; // 완제품 후처리에 필요
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
        
        // 타 테이블 후처리
        let isMat = header.target_type == 'P01' ? true : false;
        let isLast = header.target_type == 'P03' ? true : false;
        let update_res = null;
        let update_inst_res = null;
        if(!isMat){ // 공정 or 완제품검사의 경우
            // 생산실적의 검사상태 업데이트
            update_res = await mariadb.transQuery('prodResultUpdate', [header.def_qty, header.pass_qty, header.refer_cd]);
            if(isLast){ // 완제품검사의 경우
                // 마지막 공정까지 끝났으므로 생산지시서(디테일) 상태 완료로 업데이트
                update_inst_res = await mariadb.transQuery('prodInstUpdate', [header.pass_qty, instCd, header.target_cd]);
                
                // 완제품을 제품LOT입고처리
                let values = [header.target_cd, header.pass_qty, header.pass_qty, header.target_cd, instCd, headerSeq];
                insert_prd_res = await mariadb.transQuery('prodIn', values);
            }
        }

        // 성공여부 판단
        if((!isMat && dtl_res != null && header_res.affectedRows > 0 && dtl_res.affectedRows > 0 && update_res.affectedRows > 0) ||
            (!isMat && header_res.affectedRows > 0 && update_res.affectedRows > 0) ||
            // 완제품 검사인 경우
            (isLast && update_inst_res.affectedRows > 0 && insert_prd_res.affectedRows > 0 && dtl_res != null && header_res.affectedRows > 0 && dtl_res.affectedRows > 0 && update_res.affectedRows > 0) ||
            (isLast && update_inst_res.affectedRows > 0 && insert_prd_res.affectedRows > 0 && header_res.affectedRows > 0 && update_res.affectedRows > 0) ||
            // 자재 검사인 경우
            (isMat && dtl_res != null && header_res.affectedRows > 0 && dtl_res.affectedRows > 0) || 
            (isMat && header_res.affectedRows > 0)){
            await mariadb.commit();
            return 'success';
        } else {
            await mariadb.rollback();
            return 'fail';
        }
    });
    
    return result;
};


// 검사결과내역 조회+검색
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
    getStdTestList,
    findTestList,
    updateTest,
    updateTestAll,
    deleteTest,
    insertTest,

    stdInsert,
    searchAll,
    
    getWaitPrdList,
    getWaitMatList,
    getActList,
    getDefList,
    testRecInsert,

    getTestRecList,
    getTestDtl,

    updateDefStatus
}