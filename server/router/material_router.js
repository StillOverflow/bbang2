const express = require("express");
const router = express.Router();
const materialService = require("../service/material_service.js");

// -----------------자재 발주서(미지시 생산계획)-------------------
router.get("/material/planList", async (req, res) => {
   let planList = await materialService.produceHeadPlanList();
   res.send(planList);
});

router.get("/material/matStockList/:plan_cd", async (req, res) => {
   let code = req.params.plan_cd;
   let matStockList = await materialService.getPlanMaterialStock(code);
   res.send(matStockList);
});

module.exports = router;
