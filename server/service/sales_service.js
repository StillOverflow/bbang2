const mariadb = require('../database/mapper.js');

//주문서 목록
const listOrder = async() => {
    let list = await mariadb.query('orderList');
    return list;
}
//주문서 목록 거래처 검색
const searchOrder = async(search) => {
    let list = await mariadb.query('orderSearch', [`%${search}%`]);
    return list;
}

module.exports = {
    listOrder,
    searchOrder,
};
