const express = require("express");
const router = express.Router();
const produceService = require("../service/produce_service.js");

/*--------------계획서-------------*/

// 전체조회
router.get('/plan', async (req, res)=>{
    let planList = await produceService.findAllPlan();
    res.send(planList);
});

// 단건조회
router.get('/plan/:no', async (req,res)=>{
    let planNo = req.params.no;
    let info = await produceService.findPlanNo(planNo);
    res.send(info);
})

// 제품조회
router.get('/plan/:no/dtl', async (req, res)=>{
    let planNo = req.params.no;
    let result = await produceService.findAllPlanDtl(planNo);
    res.send(result);
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
    let instInfo = req.body;
    let result = await produceService.instInsert(instInfo);
    res.send(result);
});

//제품별 공정 조회
router.get('/inst/:no/flow', async (req,res)=>{
    let prodNo = req.params.no;
    let info = await produceService.findInstFlow(prodNo);
    res.send(info);
  })

 //제품 공정별 자재재 조회
router.get('/inst/:no/mat', async (req,res)=>{
    let prodNo = req.params.no;
    let info = await produceService.findInstMatFlow(prodNo);
    res.send(info);
  })

module.exports = router;