const express = require("express");
const router = express.Router();
const salesService = require("../service/sales_service.js");

/* ---------------------------주문서--------------------------------- */
//주문서 목록 조회
router.get('/sales', async (req, res) => {
    try {
        let orderList = await salesService.listOrder();
        res.send(orderList);
    } catch (error){
        console.log("router",error);
    }
    
});

//주문서 목록 검색
router.get('/sales/search/', async (req, res) => {
    try {
        let salesNo = req.query.no;
        let std = req.query.st;
        let etd = req.query.et;
        
        let info = await salesService.searchOrder(salesNo,std,etd);
        res.send(info);
    } catch (error) {
        console.error(error);
    }
    
});

//주문서 등록
router.post('/sales/ord', async (req, resp) => {
  let values = req.body; // 객체 또는 배열로 값을 받을 수 있음
  console.log("router",values);
  let result = await salesService.insertOrder(values);
  resp.send(result);
});


/* ---------------------------------출고제품--------------------------------------- */







/* -----------------------------------모달창----------------------------------------- */
//거래처 조회(모달)
router.get('/moacc', async (req, res)=>{
    let moAccList = await salesService.listAccMo();
    res.send(moAccList);
});
//담당자 조회(모달)
router.get('/momem', async (req, res)=>{
    let moMemList = await salesService.listMemMo();
    res.send(moMemList);
});
//제품 조회(모달)
router.get('/mopro', async (req, res)=>{
    let moProList = await salesService.listProMo();
    res.send(moProList);
});
//주문서 조회(모달)
router.get('/moord', async (req, res)=>{
    let moOrdList = await salesService.listOrderMo();
    res.send(moOrdList);
});

module.exports = router;
