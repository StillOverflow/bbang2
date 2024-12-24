const mariadb = require('../database/mapper.js');

// ^ ------------------------- 자재 발주서(미지시 생산계획) -------------------------
// 생산 계획서 Header 조회
const produceHeadPlanList = async() => {
    let list = await mariadb.query('produceHeadPlanList');
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

// ^ ------------------------- 자재 발주관리 -------------------------
// 자재 발주서 조회
const getMaterialOrder = async(code)=> {
    let list = await mariadb.query('getMaterialOrder', code);
    return list;
} 

module.exports = {
    produceHeadPlanList,
    planListSearch,
    getPlanMaterialStock,
    getMaterialOrder,
}