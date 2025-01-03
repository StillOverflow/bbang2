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


/**
 * 주문 등록
 * @param {*} values 
 * @returns 
 */
const insertOrder = async (values) => {

    let seq = (await mariadb.query('orderSeq'))[0].order_cd;
    let samples = values[0]; // 배열로 넘긴게 첫번째가 헤드부분이고 두번째가 데테일 부분임(2개가 끝 헷갈렸음)
    samples.seq = seq; //seq 넘기기 { } (배열로 받은걸 여기서 객체로 하나씩 만들어서 set절로 바꿔보기)
    

    let order = await mariadb.query('orderInsert', samples);
    let order_dtl = await mariadb.query('orderDtlInsert', [seq, values[1]]); // 배열에 디테일 부분이랑 시퀀스를 같이 넘김

    if(order.affectedRows > 0 && order_dtl.affectedRows > 0){
        mariadb.commit();
        return {"result" : "success"};
    } else {
        mariadb.rollback();
        return {"result" : "fail"};
    }
};

//주문서 상세(헤드부분)
const listDtlOrder = async (no) => {
    let list = await mariadb.query('orderDtlList',no);
    return list;
}; 

//주문서 상세(디테일부분)
const listDtlOrderDtl = async (no) => {
    let list = await mariadb.query('dtlOrderDtlList',no);
    return list;
};

//주문서 삭제
const deleteOrder = async (no) => {
    let del = await mariadb.query('orderDelete',no);

    if(del.affectedRows > 0){ // 모두 성공했는지 판단
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};

//주문서 단건삭제
const deleteListOrder = async (no) => {
    let del = await mariadb.query('orderListDelete',no);

    if(del.affectedRows > 0){ // 모두 성공했는지 판단
        mariadb.commit();
        return {"result" : "success"};
    } else {
        mariadb.rollback();
        return {"result" : "fail"};
    }
};

//주문서 업데이트,등록 한번에 하기
const updateOrders = async (updateInfo) => {
    let resultArr = [];
    for (const val of updateInfo){  

        if(val.order_dtl_cd){ //수정될 행
            let obj = {
                order_qty : val.order_qty,
                note : val.note
            }
            let updateRes = await mariadb.query('orderUpdate', [obj, val.order_dtl_cd]);

            if(updateRes.affectedRows > 0){
                resultArr.push("succeess");
            }else{
                resultArr.push("fail");
            }            
        }else{ //추가될 행
            let obj = {
                order_cd: val.order_cd,
                prd_cd: val.prd_cd, 
                prd_nm : val.prd_nm,
                order_qty: val.order_qty,
                note: val.note
            }
            console.log("service",obj);
            let insertRes = await mariadb.query('orderUpdateInsert', [obj]); 

            if(insertRes.affectedRows > 0){
                resultArr.push("succeess");
            }else{
                resultArr.push("fail");
            }
        }
    }
    if(resultArr.includes("fail")){ // 모두 성공했는지 판단
        mariadb.rollback();
        return {"result" : "fail"};       
    } else {
        mariadb.commit();
        return {"result" : "success"};        
    }
}

//주문서 수정
const updateOrder = async (odtNo, updateInfo) => {
    let datas = [updateInfo, odtNo];
    console.log("service",datas);
    let update = await mariadb.query('orderUpdate', datas);

    if(update.affectedRows > 0){ // 모두 성공했는지 판단
        mariadb.commit();
        return {"result" : "success"};
    } else {
        mariadb.rollback();
        return {"result" : "fail"};
    }
};

//주문서 수정을 위한 삭제
const deleteUpdateOrder = async (no) => {
    let del = await mariadb.query('orderUpdateDelete',no);

    if(del.affectedRows > 0){ // 모두 성공했는지 판단
        mariadb.commit();
        return {"result" : "success"};
    } else {
        mariadb.rollback();
        return {"result" : "fail"};
    }
};

//주문서 수정을 위한 등록
const insertUpdateOrder = async (values) => {

    let order_dtl = await mariadb.query('orderUpdateInsert', values); 

    if(order_dtl.affectedRows > 0){
        mariadb.commit();
        return {"result" : "success"};
    } else {
        mariadb.rollback();
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
//     seq = values.header_cd; 주현이가 써준거 업데이트랑 인서트 따로하게
// if(values.type == update){
//     let prdOutDtl = await mariadb.query('productOutDtlUpdate', [seq, values[1]]); 
// }else{
//     let prdOutDtl = await mariadb.query('productOutDtlInsert', [seq, values[1]]); 
// }

    let seq = (await mariadb.query('productOutSeq'))[0].prd_out_cd;
    let samples = values[0]; 
    samples.seq = seq; 
    
    //길이를 측정해서 안 들어오면 값이 안들어오면 실행이 안되게 하기
    if(Object.keys(values).length == 0){   
        return {"result" : "fail"};
    }
    //헤더 테이블 등록
    let prdOut = await mariadb.query('productOutInsert', samples);
    //디테일 테이블 등록
    let prdOutDtl = await mariadb.query('productOutDtlInsert', [seq, values[1]]); 

    //등록할 때 출고된 만큼 제품수량 감속하게 업데이트
    // let i = 0;      //sql.js(sales.js)에서 쿼리를 반복 시켰는데 쿼리구문은 하나만 있어야 해서 서비스에서 진행(insert는 valuesf를 반복시키는거라 쿼리는 하나임)
    // for (const obj of values[2]){                                                                   //forEach는 async,await을 쓸수가 없다 그래서 for of문 사용 
    //     let prdOutQty = await mariadb.query('productOutQty', [obj.prd_out_qty, obj.prd_lot_cd]);    // 수정이 되었을때 1이 되므로 0보다 클때 i를 한개씩 더함
    //     if(prdOutQty.affectedRows > 0){                                                             //배열의 길이와 i의 길이를 비교해서 업데이트가 다 되었는지 확인
    //         i++;
    //     }
    // }

    //출고등록시 주문서 상태변환
    let orderStautsPrdOut = await mariadb.query('orderStautsPrdOut', samples.order_cd);
    console.log("serviceStatus",samples.order_cd)
    
    if(prdOut.affectedRows > 0 && 
       prdOutDtl.affectedRows > 0 && 
       //values[2].length  == i &&
       orderStautsPrdOut.affectedRows > 0) {

        mariadb.commit();
        return {"result" : "success"};
    } else {
        mariadb.rollback();
        return {"result" : "fail"};
    }

};

//출고 제품 상세(헤드)
const listDtlOutPrd = async (no) => {
    let list = await mariadb.query('prdOutDtlList',no);
    return list;
}; 

//출고 제품 상세(디테일 LOT)
const listLotDtlOutPrd = async (no) => {
    let list = await mariadb.query('prdOutDtlLotList',no);
    return list;
};

//출고 제품 삭제
const deleteOutPrd = async (no) => {
    let del = await mariadb.query('prdOutDelete',no);

    if(del.affectedRows > 0){ 
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};
//출고 제품 삭제시 제품수량 원복
const qtyDeleteOutPrd = async (values) => {
    
    let i = 0;      
    for (const obj of values){                                  
                           
        let prdOutQty = await mariadb.query('prdOutDeleteQty', [obj.prd_out_qty, obj.prd_lot_cd]);    
        if(prdOutQty.affectedRows > 0){      
            i++;
        }
    }
    if(values.length  == i) {
         return {"result" : "success"};
     } else {
         return {"result" : "fail"};
     }
};
//출고 제품 단건삭제
const deleteListOutPrd = async (no) => {
    let del = await mariadb.query('prdOutListDelete',no);

    if(del.affectedRows > 0){ 
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};

//출고 제품 수정(업데이트, 등록 한번에 하기)
const updatePrdOut = async (updateInfo) => {
    let resultArr = [];
    for (const val of updateInfo){  

        if(val.prd_out_dtl_cd){ //수정될 행
            let obj = {
                prd_out_qty : val.prd_out_qty,
                note : val.note
            }
            let updateRes = await mariadb.query('prdOutUpdate', [obj, val.prd_out_dtl_cd]);

            if(updateRes.affectedRows > 0){
                resultArr.push("succeess");
            }else{
                resultArr.push("fail");
            }            
        }else{ //추가될 행
            let obj = {
                prd_out_cd: val.prd_out_cd,
                order_dtl_cd: val.order_dtl_cd, 
                prd_cd : val.prd_cd,
                prd_out_qty: val.prd_out_qty,
                prd_lot_cd: val.prd_lot_cd,
                note: val.note
            }
            let insertRes = await mariadb.query('prdOutUpdateInsert', [obj]); 

            if(insertRes.affectedRows > 0){
                resultArr.push("succeess");
            }else{
                resultArr.push("fail");
            }
        }
    }
    if(resultArr.includes("fail")){ // 모두 성공했는지 판단
        mariadb.rollback();
        return {"result" : "fail"};       
    } else {
        mariadb.commit();
        return {"result" : "success"};        
    }
};

//출고완료시 업데이트
const updatePrdOutEnd = async (updateInfo) => {
    let resultArr = [];
    for (const val of updateInfo){

        let updateRes = await mariadb.query('productOutEndQty', [val.prd_out_qty , val.prd_lot_cd]);
        
        if(updateRes.affectedRows > 0){
            resultArr.push("succeess");
        }else{
            resultArr.push("fail");
        } 

        let statusRes = await mariadb.query('orderStautsPrdOutEnd', val.order_cd);

        if(statusRes.affectedRows > 0){
            resultArr.push("succeess");
        }else{
            resultArr.push("fail");
        }
    }

    if(resultArr.includes("fail")){ // 모두 성공했는지 판단
        mariadb.rollback();
        return {"result" : "fail"};       
    } else {
        mariadb.commit();
        return {"result" : "success"};        
    }
};
//출고 완료 확인
const endOutPrd = async (no) => {
    let list = await mariadb.query('prdOutEnd', no);
    console.log("출고서비스 ",list)
    return list;
}

/* ----------------------------------------------------제품 반품--------------------------------------------------------- */

//반품 제품 목록 조회
const listReturn = async () => {
    let list = await mariadb.query('returnList')
    return list;
}

//반품제품조회-거래처, 날짜 따로 검색
const searchReturn = async (search, std, etd) => {
    try {
        let searchObj = {
            search,
            std,
            etd
        }
        const list = await mariadb.query('returnSearch', searchObj);
        return list;
    } catch (err) {
        console.error("Error searching orders 실패:", err);
        throw err;
    }
};

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
        mariadb.commit();
        return {"result" : "success"};
    } else {
        mariadb.rollback();
        return {"result" : "fail"};
    }
};

//반품 제품 상세(헤드)
const listDtlReturn = async (no) => {
    let list = await mariadb.query('returnDtlList',no);
    return list;
}; 

//반품 제품 상세(디테일)
const listDtlReturnDtl = async (rtcd,pdcd) => {
    try {
        let searchObj = {
            rtcd,
            pdcd
        }
        const list = await mariadb.query('dtlReturnDtlList',searchObj);
        return list;
    } catch (err) {
        console.error("Error searching dtlReturnDtlList 실패:", err);
        throw err;
    }
};

//반품 제품 상세(디테일 LOT)
const listLotDtlReturn = async (no) => {
    let list = await mariadb.query('returnDtlLotList',no);
    return list;
};

//반품 제품 삭제
const deleteReturn = async (no) => {
    let del = await mariadb.query('returnDelete',no);

    console.log(del);

    if(del.affectedRows > 0){ 
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};

//반품 제품 단건 삭제
const deleteListReturn = async (no) => {
    let del = await mariadb.query('returnListDelete',no);

    if(del.affectedRows > 0){ // 모두 성공했는지 판단
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};

//반품 제품 수정(업데이트, 등록 한번에 하기)
const updateReturn = async (updateInfo) => {
    let resultArr = [];
    for (const val of updateInfo){  

        if(val.prd_return_dtl_cd){ //수정될 행
            let obj = {
                prd_return_qty : val.prd_return_qty,
                note : val.note
            }
            let updateRes = await mariadb.query('returnUpdate', [obj, val.prd_return_dtl_cd]);

            if(updateRes.affectedRows > 0){
                resultArr.push("succeess");
            }else{
                resultArr.push("fail");
            }            
        }else{ //추가될 행
            let obj = {
                prd_return_cd: val.prd_return_cd,
                prd_cd: val.prd_cd, 
                prd_return_qty : val.prd_return_qty,
                prd_lot_cd: val.prd_lot_cd,
                note: val.note,
                prd_out_dtl_cd: val.prd_out_dtl_cd
            }
            let insertRes = await mariadb.query('returnUpdateInsert', [obj]); 

            if(insertRes.affectedRows > 0){
                resultArr.push("succeess");
            }else{
                resultArr.push("fail");
            }
        }
    }
    if(resultArr.includes("fail")){ // 모두 성공했는지 판단
        mariadb.rollback();
        return {"result" : "fail"};       
    } else {
        mariadb.commit();
        return {"result" : "success"};        
    }
};

//반품 수정을 위한 삭제
const  deleteUpdateReturn = async (no) => {
    let del = await mariadb.query('returnUpdateDelete',no);

    if(del.affectedRows > 0){ 
        return {"result" : "success"};
    } else {
        return {"result" : "fail"};
    }
};

//반품 수정을 위한 등록
const insertUpdateReturn = async (values) => {

    let return_dtl = await mariadb.query('returnUpdateInsert', values); 
    console.log("service",return_dtl);

    if(return_dtl.affectedRows > 0){

        return {"result" : "success"};
    } else {

        return {"result" : "fail"};
    }
};


/* ----------------------------------------------------제품 재고 조회--------------------------------------------------------- */

// 제품 재고 조회
const listAllProduct = async () => {
    let list = await mariadb.query('productAllList')
    return list;
};

// 제품명 검색
const searchListAllPrd = async (search) => {
    let info = await mariadb.query('prdAllListSearch',search)
    return info;
}

// 제품당 LOT조회
const listLotPrd = async (prd) => {
    let info = await mariadb.query('prdLotList',prd)
    return info;
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
    listDtlOrder,
    listDtlOrderDtl,
    deleteOrder,
    deleteListOrder,
    updateOrders,
    updateOrder,
    deleteUpdateOrder,
    insertUpdateOrder,


    //제품출고
    listOutPrd,
    searchPrdOut,
    listOrderOut,
    listLotOut,
    insertPrdOut,
    listDtlOutPrd,
    listLotDtlOutPrd,
    deleteOutPrd,
    qtyDeleteOutPrd,
    deleteListOutPrd,
    updatePrdOut,
    updatePrdOutEnd,
    endOutPrd,

    //제품반품
    listReturn,
    searchReturn,
    listPOutReturn,
    searchRTLot,
    InsertPrdReturn,
    listDtlReturn,
    listDtlReturnDtl,
    listLotDtlReturn,
    deleteReturn,
    deleteListReturn,
    updateReturn,
    deleteUpdateReturn,
    insertUpdateReturn,

    //제품재고조회
    listAllProduct,
    searchListAllPrd,
    listLotPrd,

    //모달창
    listAccMo,
    listMemMo,
    listProMo,
    listOrderMo,
    listOutPrdMo,

};
