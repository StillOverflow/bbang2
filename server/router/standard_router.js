const express = require("express");
const router = express.Router();
const standardService = require("../service/standard_service.js");
// -----------------BOM-------------------
//제품 전체조회
router.get("/standard/products", async (req, res) => {
  let prdList = await standardService.findAllPrd();
  res.send(prdList);
});
//제품 키워드 검색
router.get("/standard/products/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  const prdList = await standardService.searchPrd(keyword);
  res.send(prdList);
});
//자재 전체조회
router.get("/standard/materials", async (req, res) => {
  let matList = await standardService.findAllMat();
  res.send(matList);
});
//자재 키워드 검색
router.get("/standard/materials/:matkeyword", async (req, res) => {
  const matkeyword = req.params.matkeyword;
  const matList = await standardService.searchMtl(matkeyword);
  res.send(matList);
});
//BOM 조회
router.get("/standard/bom/:prd_cd", async (req, res) => {
  let prcCd = req.params.prd_cd;
  let bomlist = await standardService.findBomByPc(prcCd);
  res.send(bomlist);
});
//BOM 추가(중복체크)
router.post("/standard/bom", async (req, res) => {
  let bomInfo = req.body;

  let result = await standardService.createBom(bomInfo);

  res.send(result);
});
//BOM 삭제
router.delete("/standard/bom/:prd_cd/:mat_cd", async (req, res) => {
  let prdCd = req.params.prd_cd;
  let matCd = req.params.mat_cd;
  let delBom = await standardService.deleteBom(prdCd, matCd);
  res.send(delBom);
});

//-----------------공정흐름도-------------------

//제품목록 조회(사용여부 포함)
router.get("/standard/productFlow", async (req, res) => {
  let prdFlowlist = await standardService.searchPrdUsage();
  res.send(prdFlowlist);
});

// 선택한 제품의 공정 흐름도 조회
router.get("/standard/flow/:prd_cd", async (req, res) => {
  let prdCd = req.params.prd_cd;
  let flowList = await standardService.searchFlow(prdCd);
  res.send(flowList);
});

//선택한 공정 자재 조회
router.get("/standard/proessMtl/:proc_flow_cd", async (req, res) => {
  let procCd = req.params.proc_flow_cd;
  let procMtllist = await standardService.searchProMtl(procCd);
  res.send(procMtllist);
});

//공정코드 조회
router.get("/standard/procCd", async (req, res) => {
  let procCdlist = await standardService.searchProcCd();
  res.send(procCdlist);
});

//공정흐름 + 자재 추가
router.post("/standard/procFlowMtl", async (req, res) => {
  let procFlowMtlInfo = req.body;
  let result = await standardService.insertProcMat(procFlowMtlInfo);
  res.send(result);
});
// 공정흐름도만 등록
router.post("/standard/flow", async (req, res) => {
  const procFlowData = req.body;
  const result = await standardService.insertProcFlow(procFlowData);
  res.send(result);
});
// 공정별 자재만 추가
router.post("/standard/processMaterial", async (req, res) => {
  const materialData = req.body;
  const result = await standardService.insertProcessMaterial(materialData);
  res.send(result);
});
// 공정별 자재 삭제
router.delete("/standard/flowMtl/:proc_mat_flow_cd", async (req, res) => {
  let procFlowMatCd = req.params.proc_mat_flow_cd;
  let result = await standardService.deleteProcessMtlFlow(procFlowMatCd);
  res.send(result);
});
// 공정 흐름도 삭제
router.delete("/standard/flow/:proc_flow_cd/:prd_cd", async (req, res) => {
  let procFlowCd = req.params.proc_flow_cd;
  let procPrdCd = req.params.prd_cd;
  let result = await standardService.deleteProcessFlow(procFlowCd, procPrdCd);
  res.send(result);
});
//순서불러오기
router.get("/standard/flowSeq/:prd_cd", async (req, res) => {
  let prdCd = req.params.prd_cd;

  let maxSeq = await standardService.getMaxProcSeq(prdCd);
  res.send(maxSeq);
});

//순서그리드
router.put("/standard/updateFlowSeq", async (req, res) => {
  const updatedSeq = req.body; 
    for (const obj of updatedSeq) {
      await standardService.updateProcSeq(obj.proc_flow_cd, obj.proc_seq);
    }
    res.send({ result: true }); 
});


//------------------자재관리-----------------------
//자재조회
router.get("/standard/allMaterials", async(req, res)=>{
  result = await standardService.bringMaterial();
  res.send(result);
})
//자재등록
router.post('/standard/material', async(req, res)=>{
  let materials = req.body;
  let result = await standardService.insertMaterial(materials);
  res.send(result);
})
//자재수정
router.put('/standard/updateMaterial/:mat_cd', async(req, res)=>{
  let matCd = req.params.mat_cd;
  let updateInfo = req.body;
  let result = await standardService.updateMaterial(matCd, updateInfo);
  res.send(result);
})
//자재삭제
router.delete('/standard/delMaterial/:mat_cd', async(req,res)=>{
  let matCd = req.params.mat_cd;
  let result = await standardService.deleteMaterial(matCd);
  res.send(result);
})

//----------------------------------------제품관리------------------------------------------------
//제품등록
router.post('/standard/product', async(req,res)=>{
  let products = req.body;
  let result = await standardService.insertProduct(products);
  res.send(result);
});

//제품수정
router.put('/standard/updateProduct/:prd_cd', async(req, res)=>{
  let prdCd = req.params.prd_cd;
  let updateInfo =req.body;
  let result = await standardService.updateProduct(prdCd, updateInfo);
  res.send(result);
});
//제품삭제
router.delete('/standard/delProduct/:prd_cd', async(req,res)=>{
  let prdCd = req.params.prd_cd;
  let result = await standardService.deleteProduct(prdCd);
  res.send(result);
})

//----------------------------------------공정관리-------------------------------------------------
router.get('/standard/process', async(req,resp)=>{
  let datas =req.query;
  let result = await standardService.processSelect(datas);
  resp.send(result);
})
module.exports = router;
