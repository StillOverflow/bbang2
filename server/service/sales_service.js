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
const insertOrder = async (values) => {

    let seq = (await mariadb.query('orderSeq'))[0].order_cd;

    let samples = values[0]; // 배열로 넘긴게 첫번째가 헤드부분이고 두번째가 데테일 부분임(2개가 끝 헷갈렸음)
    samples.seq = seq; //seq 넘기기
    /* 원래 배열로 만들어서 넘겨서 받을려고 했는데 받는곳에서 객체로 받는거로 바꿔서 그냥 sample로 넘어감
    let arr = [
        samples.order_dt, 
        samples.due_dt, 
        samples.mem_id, 
        samples.act_cd,
    ];  
    arr.push(seq);
    */
    
    let order = await mariadb.query('orderInsert', samples);

    let order_dtl = await mariadb.query('orderDtlInsert', [seq, values[1]]); // 배열에 디테일 부분이랑 시퀀스를 같이 넘김

    if(order.affectedRows > 0 & order_dtl.affectedRows > 0){
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }

};

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
     insertOrder,

     listAccMo,
     listMemMo,
     listProMo,
    // infoAccMo,
    // infoMemMo,
};
