const express = require("express");
const router = express.Router();
const materialService = require("../service/material_service.js");

//! ------------------------- 자재 발주서(미지시 생산계획) -------------------------
router.get("/material/planList", async (req, res) => {
   let planList = await materialService.produceHeadPlanList();
   res.send(planList);
});

//주문서 목록 검색
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

router.get("/material/matStockList/:plan_cd", async (req, res) => {
   let code = req.params.plan_cd;
   let result = await materialService.getPlanMaterialStock(code);
   res.send(result);
});

//! ------------------------- 자재 발주서 관리 -------------------------
router.get("/material/orderList", async (req, res) => {
   let result = await materialService.getMaterialOrder();
   res.send(result);
});

router.get("/material/orderDetailList/:code", async (req, res) => {
   let code = req.params.code;

   let result = await materialService.getMaterialOrderDetail(code);
   res.send(result);
});

//! ------------------------------ 자재 출고조회 ------------------------------
router.get("/material/produceInstruction", async (req, res) => {
   let result = await materialService.getProduceInstruction(req.query);

   res.send(result);
});

router.get("/material/out", async (req, res) => {
   console.log("router => ", req.query)
   let result = await materialService.getMaterialOutForProduction(req.query);
   console.log("결과 -=> ", result)
   res.send(result);
});

module.exports = router;
