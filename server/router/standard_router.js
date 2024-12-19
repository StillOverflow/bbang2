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
router.get("/standard/proessMtl/:proc_cd", async (req, res) => {
  let procCd = req.params.proc_cd;
  let procMtllist = await standardService.searchProMtl(procCd);
  res.send(procMtllist);
});

//공정코드 조회
router.get("/standard/procCd", async (req, res) => {
  let procCdlist = await standardService.searchProcCd();
  res.send(procCdlist);
});
// // 공정 흐름도 추가
router.post("/standard/procFlow", async (req, res) => {
  let procFlowInfo = req.body;
  let result = await standardService.InsertProcMat(procFlowInfo);
  res.send(result);
});
// 공정 순서 업데이트
router.put("/processFlow/seq", async (req, res) => {
  const { updatedProcesses } = req.body; // [{ proc_seq, proc_cd }, ...]
  let result = await standardService.updateProcessSequence(updatedProcesses);
  res.send(result);
});
// // 공정 흐름도 삭제
// router.delete('/standard/flow/:flow_code', async (req, res) => {
//     let { flow_code } = req.params;
//     let result = await standardService.deleteFlow(flow_code);
//     res.send(result);
// });

//------------------공통코드-----------------------
router.get("/standard/commList/:cd", async (req, res) => {
  let comCd = req.params.cd;
  let result = await standardService.findAllComm(comCd);
  res.send(result);
});

module.exports = router;
