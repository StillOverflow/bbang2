const mariadb = require('../database/mapper.js');
//! ------------------------------ 자재 발주서(미지시 생산계획) ------------------------------
// 생산 계획서 Header 조회
const produceHeadPlanList = async() => {
    let list = await mariadb.query('produceHeadPlanList');
    console.log("produceHeadPlanList service => ", list);
    return list;
}

const planListSearch = async (startDt, endDt) => {
    try {
        let searchDate = {
            startDt,
            endDt
        }
        const list = await mariadb.query('planListSearch', searchDate);
        return list;
    } catch (err) {
        throw err;
    }
};

// 계획서 디테일 상품에 대한 자재 재고 조회
const getPlanMaterialStock = async(code)=> {
    let list = await mariadb.query('getPlanMaterialStock', code);
    return list;
} 

//! ------------------------------ 자재 발주관리 ------------------------------
// 자재 발주서 헤더 조회
const getMaterialOrder = async(code)=> {
    let list = await mariadb.query('getMaterialOrder', code);
    return list;
} 

// 자재 발주서 디테일 조회
const getMaterialOrderDetail = async(code) => {
    let list = await mariadb.query('getMaterialOrderDetail', code);
    return list;
}

//! ------------------------------ 자재 재고조회 ------------------------------
// 자재 재고 조회
const getMaterialStockList = async(searchObj) => {
    let list = await mariadb.query('getMaterialStockList', searchObj);

    return list;
}

// 자재 LOT별 재고 조회
const getMaterialStockLotList = async(searchObj) => {
    let list = await mariadb.query('getMaterialStockLotList', searchObj);

    return list;
}















//! ------------------------------ 자재 출고조회 ------------------------------
// 생산 중이거나 생산 완료된 지시서 리스트 조회
const getProduceInstruction = async(searchObj) => {
    let list = await mariadb.query('getProduceInstruction', searchObj);
    return list;
}

// 지시서에 대한 자재 출고 내역 getMaterialOutForProduction
const getMaterialOutForProduction = async(data) => {
    console.log("service searchObj => ", data)
    let list = await mariadb.query('getMaterialOutForProduction', data);
    return list;
}


module.exports = {
    produceHeadPlanList,         // 미지시 생산계획서 조회
    planListSearch,              // 미지시 생산계획서 검색
    getPlanMaterialStock,        // 미지시 생산 계획서에 대한 자재 재고 조회

    getMaterialOrder,            // 자재 발주서 헤더 조회
    getMaterialOrderDetail,      // 자재 발주서 디테일 조회

    getMaterialStockList,        // 자재 재고 조회
    getMaterialStockLotList,     // 자재 lot별 재고 조회

    getProduceInstruction,       // 생산완료된 생산지시서 조회
    getMaterialOutForProduction, // 지시서에 대한 자재 출고 내역
}