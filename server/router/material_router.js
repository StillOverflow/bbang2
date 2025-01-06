const express = require("express");
const router = express.Router();
const materialService = require("../service/material_service.js");

//! ------------------------- 자재 발주서(미지시 생산계획) -------------------------
// 주문서 리스트
router.get("/material/planList", async (req, res) => {
   let planList = await materialService.produceHeadPlanList();
   res.send(planList);
});

// 주문서 목록 검색
router.get('/material/planList/search/', async (req, res) => {
   try {
      let startDt = req.query.startDt;
      let endDt = req.query.endDt;
   
      let result = await materialService.planListSearch(startDt, endDt);
      res.send(result);
   } catch (error) {
      console.error(error);
   }
});

// 미지시 계획건에 대한 자재 재고 조회
router.get("/material/matStockList/:plan_cd", async (req, res) => {
   let code = req.params.plan_cd;
   let result = await materialService.getPlanMaterialStock(code);
   res.send(result);
});

//! ------------------------------ 자재 발주서 관리 ------------------------------
// 자재 발주서 조회
router.get("/material/orderList", async (req, res) => {
   let result = await materialService.getMaterialOrder();
   res.send(result);
});

// 자재 발주서 디테일 조회
router.get("/material/orderDetailList/:code", async (req, res) => {
   let code = req.params.code;

   let result = await materialService.getMaterialOrderDetail(code);
   res.send(result);
});

//! ------------------------------ 자재 입고관리 ------------------------------
// 입고 대기목록
router.get("/material/beforeIn", async (req, res) => {
   let result = await materialService.getMaterialBeforeIn();
   res.send(result);
});

// 자재 입고 등록
router.post("/material/in", async (req, res) => {
   console.log("req.body => ", req.body);
   let result = await materialService.materialInsert(req.body);
   res.send(result);
   console.log("router result => ",result)
});

//! ------------------------------ 자재 재고 조회------------------------------
// 자재 재고 조회
router.get("/material/stockList", async (req, res) => {
   let result = await materialService.getMaterialStockList(req.query);

   res.send(result);
});

router.get("/material/stockLotList", async (req, res) => {
   let result = await materialService.getMaterialStockLotList(req.query);

   res.send(result);
});















//! ------------------------------ 자재 출고조회 ------------------------------
// 생산중이거나 완료된건에 대한 상산 계획서 조회
router.get("/material/produceInstruction", async (req, res) => {
   let result = await materialService.getProduceInstruction(req.query);
   console.log("result => ", result)
   res.send(result);
});

// 자재 출고 내역조회
router.get("/material/out", async (req, res) => {
   let result = await materialService.getMaterialOutForProduction(req.query);
   res.send(result);
});

module.exports = router;
