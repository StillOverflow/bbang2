const express = require("express");
const router = express.Router();
const salesService = require("../service/sales_service.js");

//주문서 목록
router.get('/sales', async (req, res) => {
    let orderList = await salesService.listOrder();
    res.send(orderList);
});

//주문서목록거래처검색
router.get('/sales/:no', async (req, res) => {
    let salesNo = req.params.no;
    let info = await salesService.searchOrder(salesNo);
    res.send(info);
});


module.exports = router;
