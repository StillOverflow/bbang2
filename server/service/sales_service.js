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

//주문서조회-거래처, 날짜 따로 검색
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

    if(order.affectedRows > 0 && order_dtl.affectedRows > 0){
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};

/* --------------------------------------------------제품 출고-------------------------------------------------------- */

//출고 제품 목록 조회
const listOutPrd = async () => {
    let list = await mariadb.query('prdOutList')
    return list;
}

//출고제품조회-거래처, 날짜 따로 검색
const searchPrdOut = async (search, std, etd) => {
    try {
        let searchObj = {
            search,
            std,
            etd
        }
        const list = await mariadb.query('prdOutSearch', searchObj);
        return list;
    } catch (err) {
        console.error("Error searching orders 실패:", err);
        throw err;
    }
};

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

//출고 등록
const insertPrdOut = async (values) => {

    let seq = (await mariadb.query('productOutSeq'))[0].prd_out_cd;
    console.log("시퀀스",values[0]);
    let samples = values[0]; 
    samples.seq = seq; 
    
    let prdOut = await mariadb.query('productOutInsert', samples);
    let prdOutDtl = await mariadb.query('productOutDtlInsert', [seq, values[1]]); 

    //등록할 때 출고된 만큼 제품수량 감속하게 업데이트
    let i = 0;      //sql.js(sales.js)에서 쿼리를 반복 시켰는데 쿼리구문은 하나만 있어야 해서 서비스에서 진행(insert는 valuesf를 반복시키는거라 쿼리는 하나임)
    for (const obj of values[2]){                                                   //forEach는 async,await을 쓸수가 없다 그래서 for of문 사용 
        let prdOutQty = await mariadb.query('productOutQty', obj.prd_lot_cd);       // 수정이 되었을때 1이 되므로 0보다 클때 i를 한개씩 더함
        if(prdOutQty.affectedRows > 0){                                             //배열의 길이와 i의 길이를 비교해서 업데이트가 다 되었는지 확인
            i++;
        }
    }
    
    if(prdOut.affectedRows > 0 && prdOutDtl.affectedRows > 0 && values[2].length  == i){
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};

/* ----------------------------------------------------제품 반품--------------------------------------------------------- */

//반품등록 출고목록 조회
const listPOutReturn = async (no)=>{
    let list = await mariadb.query('returnPOutList', no);
    return list;
}

//반품 등록 LOT 선택
const searchRTLot = async (pocd,pdcd) => {
    try {
        let searchObj = {
            pocd,
            pdcd
        }
        const list = await mariadb.query('returnLot',searchObj);
        return list;
    } catch (err) {
        console.error("Error searching returnLot 실패:", err);
        throw err;
    }
};

//반품 등록
const InsertPrdReturn = async (values) => {

    let seq = (await mariadb.query('productReturnSeq'))[0].prd_return_cd;

    console.log(values[0]);
    let samples = values[0]; 
    samples.seq = seq; 
    
    let prdReturn = await mariadb.query('productReturnInsert', samples);
    let prdReturnDtl = await mariadb.query('productReturnDtlInsert', [seq, values[1]]); // 배열에 디테일 부분이랑 시퀀스를 같이 넘김

    if(prdReturn.affectedRows > 0 && prdReturnDtl.affectedRows > 0){
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};



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
//출고목록  조회(모달)
const listOutPrdMo = async() => {
    let list = await mariadb.query('moPrdOutList');
    return list;
 }

module.exports = {
    //주문서
    listOrder,
    searchOrder,
    insertOrder,


    //제품출고
    listOutPrd,
    searchPrdOut,
    listOrderOut,
    listLotOut,
    insertPrdOut,
    
    //제품반품
    listPOutReturn,
    searchRTLot,
    InsertPrdReturn,


    //모달창
    listAccMo,
    listMemMo,
    listProMo,
    listOrderMo,
    listOutPrdMo,

};
