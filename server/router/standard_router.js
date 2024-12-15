const express = require("express");
const router = express.Router();
const standardService = require("../service/standard_service.js");

//제품 전체조회
router.get('/standard/products', async (req,res)=>{
    let prdList = await standardService.findAllPrd();
    res.send(prdList);
})
//자재 전체조회
router.get('/standard/materials', async(req,res)=>{
    let matList = await standardService.findAllMat();
    res.send(matList);
})
//BOM 조회
router.get('/standard/bom/:prd_cd', async(req, res)=>{
    let prcCd = req.params.prd_cd;
    let bomlist = await standardService.findBomByPc(prcCd);
    res.send(bomlist);
});

//BOM 추가
router.post('/standard/bom',async(req,res)=>{
    let bomInfo = req.body;
    let result = await standardService.createBom(bomInfo);
    res.send(result);
})
//BOM 삭제
router.delete('/standard/bom/:prd_cd/:mat_cd',async(req, res)=>{
    let prdCd = req.params.prd_cd;
    let matCd = req.params.mat_cd;
    let delBom = await standardService.deleteBom(prdCd, matCd);
    res.send(delBom);
})




module.exports = router;
