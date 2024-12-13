const express = require("express");
const router = express.Router();
const standardService = require("../service/standard_service.js");

//제품 전체조회
router.get('/productList', async (req,res)=>{
    let prdList = await standardService.prdList();
    res.send(prdList);
})

//bom 조회
router.get('/bom/:prd_cd', async(req, res)=>{
    let bomlist = await standardService.bomlist();
    res.send(bomlist);
});

//bom 추가
router.put('/bom',async(req,res)=>{
    let bomInfo = req.body;
    let result = await standardService.createBom(bomInfo);
    res.send(result);
})




module.exports = router;
