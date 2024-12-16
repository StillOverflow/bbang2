const mariadb = require('../database/mapper.js');

//주문서 목록
const listOrder = async() => {
    try {
        let list = await mariadb.query('orderList');
        return list;
    } catch (err) {
        console.error("service",err)
    }
    
}
//주문서 목록 거래처,날짜 검색
// const searchOrder = async(search,std,etd) => {
//     let list = await mariadb.query('orderSearch', [`%${search}%`,std,etd]);
//     console.log(search,std,etd);
//     return list;   
// }
//거래처, 날짜 따로 검색
const searchOrder = async (search, std, etd) => {
    try {
       let searchObj = {
        search,
        std,
        etd
       }
       const list = await mariadb.query('orderSearch', searchObj);
        return list;
    } catch (err) {
        console.error("Error searching orders 실패:", err);
        throw err;
    }
};




module.exports = {
    listOrder,
    searchOrder,
};
