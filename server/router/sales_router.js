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

//거래처 조회(모달)
router.get('/moacc', async (req, res)=>{
    let moAccList = await salesService.listAccMo();
    res.send(moAccList);
});

module.exports = router;
