const mariadb = require('../database/mapper.js');
const sales = require('../database/sqls/sales.js');

//주문서 목록
const listOrder = async() => {
    let list = await mariadb.query('orderList');
    return list;
}
//주문서 목록 거래처,날짜 검색
// const searchOrder = async(search,std,etd) => {
//     let list = await mariadb.query('orderSearch', [`%${search}%`,std,etd]);
//     console.log(search,std,etd);
//     return list;   
// }

//따로 검색도전
const searchOrder = async (search, std, etd) => {
    try {
        // 동적 쿼리와 매개변수 가져오기
        const { query, params } = sales.orderSearch(search, std, etd);
        console.log("쿼리결과:", query);
        console.log("쿼리Parameters:", params);
        
        const list = await mariadb.query(query, params);
        return list;
    } catch (err) {
        console.error("Error searching orders:", err);
        throw err;
    }
};




module.exports = {
    // listOrder,
    // searchOrder,
};
