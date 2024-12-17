const mariadb = require('../database/mapper.js');

/* ----------------------주문서------------------------ */
//주문서 목록 조회
const listOrder = async() => {
    try {
        let list = await mariadb.query('orderList');
        return list;
    } catch (err) {
        console.error("service",err)
    }
};
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

//주문서 등록

//거래처 조회(모달)
const listAccMo = async() => {
    let list = await mariadb.query('moAccList');
    return list;
};
//거래처 단건조회(모달)-필요 없어짐...
// const infoAccMo = async(no) => {
//     let list = await mariadb.query('moAccInfo', no);
//     return list;
// };
//담당자 조회(모달)
const listMemMo = async() => {
    let list = await mariadb.query('moMemList');
    return list;
};
//담당자 단건조회(모달)-필요 없어짐...
// const infoMemMo = async(no) => {
//     let list = await mariadb.query('moMemInfo', no);
//     return list;
// };
//제품 조회(모달)
const listProMo = async() => {
    let list = await mariadb.query('moProList');
    return list;
}


module.exports = {
     listOrder,
     searchOrder,
     listAccMo,
     listMemMo,
     listProMo,
    // infoAccMo,
    // infoMemMo,
};
