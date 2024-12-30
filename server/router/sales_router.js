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
  let result = await salesService.insertOrder(values);
  resp.send(result);
});

//주문서 상세(헤드부분)
router.get('/sales/orderList/:no', async (req, res) => {
    let orderNo = req.params.no;
    let info = await salesService.listDtlOrder(orderNo);
    res.send(info);
});

//주문서 상세(디테일부분)
router.get('/sales/orderDtlList/:no', async (req, res) => {
    let orderNo = req.params.no;
    let info = await salesService.listDtlOrderDtl(orderNo);
    res.send(info);
});

//주문서 삭제
router.delete('/sales/orderDelete/:del', async (req, res) => {
    let del = req.params.del;
    console.log("router",del)
    let ordDel = await salesService.deleteOrder(del);
    res.send(ordDel);
});

//주문서 수정
router.put('/sales/orderUpdate/:no', async (req, res) => {
    let odtNo = req.params.no;
    let updateInfo = req.body;
    let result = await salesService.updateOrder(odtNo, updateInfo);
    res.send(result);
  });

/* ---------------------------------출고제품--------------------------------------- */

//출고 제품 목록 조회
router.get('/sales/prdList', async (req, res) => {
    let prdOutList = await salesService.listOutPrd();
    res.send(prdOutList);
});

//출고 제품 목록 검색
router.get('/sales/searchPo/', async (req, res) => {
    try {
        let salesNo = req.query.no;
        let std = req.query.st;
        let etd = req.query.et;
        
        let info = await salesService.searchPrdOut(salesNo,std,etd);
        res.send(info);
    } catch (error) {
        console.error(error);
    }
    
});

// 출고 등록 주문서 조회
router.get('/sales/ordList/:no', async (req, res) => {
    let orderNo = req.params.no;
    let info = await salesService.listOrderOut(orderNo);
    res.send(info);
});

//출고 등록 LOT 선택
router.get('/sales/lot/:no', async (req, res) => {
    let lotNo = req.params.no;
    let info = await salesService.listLotOut(lotNo);
    res.send(info);
});

//출고 등록
router.post('/sales/prdOut', async (req, resp) => {
    let values = req.body; // 객체 또는 배열로 값을 받을 수 있음
    let result = await salesService.insertPrdOut(values);
    resp.send(result);
});

/* ---------------------------------반품제품--------------------------------------- */

//반품 제품 목록 조회
router.get('/sales/returnList', async (req, res) => {
    let returnList = await salesService.listReturn();
    res.send(returnList);
});

//반품 제품 목록 검색
router.get('/sales/searchRT/', async (req, res) => {
    try {
        let salesNo = req.query.no;
        let std = req.query.st;
        let etd = req.query.et;
        
        let info = await salesService.searchReturn(salesNo,std,etd);
        res.send(info);
    } catch (error) {
        console.error(error);
    }
    
});

//반품등록 출고목록 조회
router.get('/sales/POL/:no', async (req, res) => {
    let prdoutNo = req.params.no;
    let info = await salesService.listPOutReturn(prdoutNo);
    res.send(info);
});

//반품 등록 LOT 선택
router.get('/sales/returnLot/', async (req, res) => {
    try {
        let pocd = req.query.poc;
        let pdcd = req.query.pdc;
        
        let info = await salesService.searchRTLot(pocd,pdcd);
        res.send(info);

    } catch (error) {
        console.error(error);
    }
    
});

//반품 등록
router.post('/sales/prdReturn', async (req, resp) => {
    let values = req.body; // 객체 또는 배열로 값을 받을 수 있음
    let result = await salesService.InsertPrdReturn(values);
    resp.send(result);
});

//반품 제품 상세(헤드)
router.get('/sales/retrunDtlList/:no', async (req, res) => {
    let returnNo = req.params.no;
    let info = await salesService.listDtlReturn(returnNo);
    res.send(info);
});

//반품 제품 상세(디테일)
router.get('/sales/dtlReturnDtlList/', async (req, res) => {
    try {
        let rtcd = req.query.rtc;
        let pdcd = req.query.pdc;
        
        let info = await salesService.listDtlReturnDtl(rtcd,pdcd);
        res.send(info);

    } catch (error) {
        console.error(error);
    }
    
});

/* -----------------------------------제품 재고 조회----------------------------------------- */

// 제품 재고 조회
router.get('/sales/prdAllList', async (req, res) => {
    let prdAllList = await salesService.listAllProduct();
    res.send(prdAllList);
});

// 제품명 검색
router.get('/sales/prdAllList/:no', async (req, res) => {
    let searchprd = req.params.no;
    let info = await salesService.searchListAllPrd(searchprd);
    res.send(info);
});

// 제품당 LOT조회
router.get('/sales/prdLotList/:no', async (req, res) => {
    let prd = req.params.no;
    let info = await salesService.listLotPrd(prd);
    res.send(info);
});

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
//출고목록 조회(모달)
router.get('/moprdout', async (req, res)=>{
    let moPrdOutList = await salesService.listOutPrdMo();
    res.send(moPrdOutList);
});

module.exports = router;
