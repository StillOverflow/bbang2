const mariadb = require('../database/mapper.js');

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
        console.error("Error searching orders 실패:", err);
        throw err;
    }
};

// 계획서 디테일 상품에 대한 자재 재고 조회
const getPlanMaterialStock = async(code)=> {
    let list = await mariadb.query('getPlanMaterialStock', code);
    return list;
} 



module.exports = {
    produceHeadPlanList,
    planListSearch,
    getPlanMaterialStock,
}