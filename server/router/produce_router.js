const express = require("express");
const router = express.Router();
const produceService = require("../service/produce_service.js");

/*--------------생산계획서-------------*/

//계획서 전체조회
router.get('/plan', async (req, res)=>{
    let searchs = req.query;
    let planList = await produceService.findAllPlan(searchs);
    res.send(planList);
});

//계획서 단건조회
router.get('/plan/:no', async (req,res)=>{
    let planNo = req.params.no;
    let planList = await produceService.findPlanNo(planNo);
    res.send(planList);
})

//계획서 제품조회
router.get('/plan/:no/dtl', async (req, res)=>{
    let planNo = req.params.no;
    let result = await produceService.findAllPlanDtl(planNo);
    res.send(result);
});

//계획서 삭제
router.delete("/plan", async (req, res) => {
    let values = req.query;
    let result = await produceService.deletePlan(values);
    res.send(result);
  });

//계획서 등록
router.post('/plan', async(req, res)=>{
  let values = req.body; // body: 객체 또는 배열로 값을 받을 수 있음
  let result = await produceService.planInsert(values);
  res.send(result);
});

/*--------------생산지시서-------------*/

//지시서 전체조회
router.get('/inst', async (req, res)=>{
    let searchs = req.query;
    let instList = await produceService.findAllInst(searchs);
    res.send(instList);
});

//지시서 단건조회
router.get('/inst/:no', async (req,res)=>{
    let instNo = req.params.no;
    let info = await produceService.findInstNo(instNo);
    res.send(info);
  })

//지시서 등록
router.post('/inst', async(req, res)=>{
  let values = req.body; // body: 객체 또는 배열로 값을 받을 수 있음
  let result = await produceService.instInsert(values);
  res.send(result);
});

//지시서 삭제
router.delete("/inst", async (req, res) => {
  let values = req.query;
  let result = await produceService.deleteInst(values);
  res.send(result);
});

//지시서 제품목록 조회
router.get('/inst/dtl/:no', async (req,res)=>{
  let instNo = req.params.no;
  let info = await produceService.findInstDtlNo(instNo);
  res.send(info);
})

//제품별 공정 조회
router.get('/inst/:no/flow', async (req,res)=>{
    let prodNo = req.params.no;
    let info = await produceService.findInstFlow(prodNo);
    res.send(info);
  })

 //제품 공정별 자재 조회
router.get('/inst/:no/mat', async (req,res)=>{
    let prodNo = req.params.no;
    let info = await produceService.findInstMatFlow(prodNo);
    res.send(info);
  })

  /* ------------------------생산공정------------------------- */

//생산실적 조회
router.get('/progress/result', async (req,res)=>{
  let searchs = req.query;
  let List = await produceService.findResultNo(searchs);
  res.send(List);
})

 //지시서 제품별 커스텀된 공정목록 조회
router.get('/progress/flow', async (req,res)=>{
  let setInfo = req.query;
  let info = await produceService.findInstCusFlow(setInfo);
  res.send(info);
})

//자재 실사용량 등록
router.put('/progress/mat', async(req, res)=>{
  let info = req.body; // body: 객체 또는 배열로 값을 받을 수 있음
  let result = await produceService.instMatUpdate(info);
  res.send(result);
});

//지시서 제품별 커스텀된 공정목록 조회 -> 설비목록
router.get('/progress/equ/:no', async (req,res)=>{
  let procNo = req.params.no;
  let info = await produceService.findInstCusEqu(procNo);
  res.send(info);
})

 //생산공정 시작
 router.put('/progress/start/:no', async (req,res)=>{
  let prodNo = req.params.no;
  let info = req.body;
  let result = await produceService.progressStart(prodNo, info);
  res.send(result);
})

module.exports = router;