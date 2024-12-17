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
//거래처 단건 조회(모달)-필요 없어짐...
// router.get('/moacc/:no', async (req, res) => {
//     let moaccNo = req.params.no;
//     let info = await salesService.infoAccMo(moaccNo);
//     res.send(info);
// });
//담당자 조회(모달)
router.get('/momem', async (req, res)=>{
    let moMemList = await salesService.listMemMo();
    res.send(moMemList);
});
//담당자 단건 조회(모달)-필요 없어짐...
// router.get('/momem/:no', async (req, res) => {
//     let momemNo = req.params.no;
//     let info = await salesService.insfoMemMo(momemNo);
//     res.send(info);
// });
//제품 조회(모달)
router.get('/mopro', async (req, res)=>{
    let moProList = await salesService.listProMo();
    res.send(moProList);
});



module.exports = router;
