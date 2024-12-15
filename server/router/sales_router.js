const express = require("express");
const router = express.Router();
const salesService = require("../service/sales_service.js");

//주문서 목록
router.get('/sales', async (req, res) => {
    let orderList = await salesService.listOrder();
    res.send(orderList);
});

//주문서목록거래처검색
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


module.exports = router;
