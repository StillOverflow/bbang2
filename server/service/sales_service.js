const mariadb = require('../database/mapper.js');

/* --------------------------------------------------주문서-------------------------------------------------------- */

//주문서 목록 조회
const listOrder = async() => {
    try {
        let list = await mariadb.query('orderList');
        return list;
    } catch (err) {
        console.error("service",err)
    }
};

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
console.log(values[0]);
    let samples = values[0]; // 배열로 넘긴게 첫번째가 헤드부분이고 두번째가 데테일 부분임(2개가 끝 헷갈렸음)
    samples.seq = seq; //seq 넘기기 { } (배열로 받은걸 여기서 객체로 하나씩 만들어서 set절로 바꿔보기)
    
    let order = await mariadb.query('orderInsert', samples);
    let order_dtl = await mariadb.query('orderDtlInsert', [seq, values[1]]); // 배열에 디테일 부분이랑 시퀀스를 같이 넘김

    if(order.affectedRows > 0 & order_dtl.affectedRows > 0){
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};

/* --------------------------------------------------제품 출고-------------------------------------------------------- */
//출고 등록 주문서 조회
const listOrderOut = async (no)=>{
    let list = await mariadb.query('outOrderLit', no);
    return list;
}

//출고 등록 LOT 선택
const listLotOut = async (no) => {
    let list = await mariadb.query('outLotList', no);
    return list;
}




/* ----------------------------------------------------모달창--------------------------------------------------------- */

//거래처 조회(모달)
const listAccMo = async() => {
    let list = await mariadb.query('moAccList');
    return list;
};
//담당자 조회(모달)
const listMemMo = async() => {
    let list = await mariadb.query('moMemList');
    return list;
};
//제품 조회(모달)
const listProMo = async() => {
    let list = await mariadb.query('moProList');
    return list;
}
//주문서 조회(모달)
 const listOrderMo = async() => {
    let list = await mariadb.query('moOrderList');
    return list;
 }


module.exports = {
    //주문서
    listOrder,
    searchOrder,
    insertOrder,


    //제품출고
    listOrderOut,
    listLotOut,
    




    //모달창
    listAccMo,
    listMemMo,
    listProMo,
    listOrderMo,

};
