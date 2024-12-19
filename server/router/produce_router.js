const express = require("express");
const router = express.Router();
const produceService = require("../service/produce_service.js");

/*--------------계획서-------------*/

// 전체조회
router.get('/plan', async (req, res)=>{
    let planList = await produceService.findAllPlan();
    res.send(planList);
});

// 코드조회
router.get('/plan/:no', async (req,res)=>{
    let planNo = req.params.no;
    let planList = await produceService.findPlanNo(planNo);
    res.send(planList);
})

// 제품조회
router.get('/plan/:no/dtl', async (req, res)=>{
    let planNo = req.params.no;
    let result = await produceService.findAllPlanDtl(planNo);
    res.send(result);
});

// 계획서 삭제
router.delete("/plan", async (req, res) => {
    console.log("히히"+req.body);
    //let result = await produceService.deletePlan(values);
    //resp.send(result);
  });
/*--------------지시서-------------*/

// 전체조회
router.get('/inst', async (req, res)=>{
    let instList = await produceService.findAllInst();
    res.send(instList);
});

// 단건조회
router.get('/inst/:no', async (req,res)=>{
    let instNo = req.params.no;
    let info = await produceService.findInstNo(instNo);
    res.send(info);
  })

// 등록

router.post('/inst', async(req, res)=>{
  let values = req.body; // body: 객체 또는 배열로 값을 받을 수 있음
  let result = await produceService.stdInsert(values);
  res.send(result);
});

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

module.exports = router;