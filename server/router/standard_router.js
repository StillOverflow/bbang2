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
//제품별 공정자재조회
router.get("/standard/procesMtlByPrd/:prd_cd", async(req,res)=>{
  let prdCd = req.params.prd_cd;
  let list = await standardService.sarchProMtlByPrd(prdCd);
  res.send(list);
})
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
//다중공정흐름 + 자재추가
router.post("/standard/multipleProcFlowMtl", async (req, res) => {
    let data = req.body; // 클라이언트에서 보낸 데이터
    let result = await standardService.insertMultipleProcMat(data); // 서비스 호출
    res.send(result);
});
//공정흐름+ 기존자재추가
router.post("/standard/procFlowStnMaterials", async(req,res)=>{
  let data = req.body;
  let result = await standardService.insertProcFlowStnMaterials(data);
  res.send(result);
})
// 공정흐름도만 등록
router.post("/standard/flow/:prd_cd", async (req, res) => {
  const procFlowData = req.body;
  let procPrdCd = req.params.prd_cd;
  const result = await standardService.insertProcFlow(procFlowData, procPrdCd);
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

//개수확인
router.get("/standard/proc_flow_mtl_usage/:mat_cd/:prd_cd", async(req, res)=>{
  let matCd = req.params.mat_cd;
  let prdCd = req.params.prd_cd;
  let result = await standardService.procMatUsage(matCd, prdCd);
  res.send(result);
})
//사용량 업데이트
router.put("/standard/updateFlowMatUsage",async(req, res)=>{
  let info = req.body;
  let result = await standardService.updateMatUsage(info);
  res.send(result);
})
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
//공정조회
router.get('/standard/process', async(req,resp)=>{
  let datas =req.query;
  let result = await standardService.processSelect(datas);
  resp.send(result);
})

//공정등록
router.post('/standard/insertProcess/:prefix', async (req, res) => {
  let processs = req.body;
  let preFix = req.params.prefix // 클라이언트에서 prefix 전달
  console.log('prefix=>',preFix);
  let result = await standardService.insertProcess(processs, preFix);
  res.send(result);
});
//공정수정
router.put('/standard/updateProcess/:proc_cd', async(req, res)=>{
  let procCd = req.params.proc_cd;
  let updateInfo =req.body;
  let result = await standardService.updateProcess(procCd, updateInfo);
  res.send(result);
});

//공정삭제
router.delete('/standard/delProcess/:proc_cd', async(req,res)=>{
  let procCd = req.params.proc_cd;
  let result = await standardService.deleteProcess(procCd);
  res.send(result);
})

//-------------------------------------거래처관리------------------------------------------------
//거래처등록
router.post('/standard/account', async(req,res)=>{
  let accounts = req.body;
  let result = await standardService.insertAccount(accounts);
  res.send(result);
});

//거래처수정
router.put('/standard/updateAccount/:act_cd', async(req, res)=>{
  let actCd = req.params.act_cd;
  let updateInfo =req.body;
  let result = await standardService.updateAccount(actCd, updateInfo);
  res.send(result);
});
//거래처삭제
router.delete('/standard/delAccount/:act_cd', async(req,res)=>{
  let actCd = req.params.act_cd;
  let result = await standardService.deleteAccount(actCd);
  res.send(result);
});

//-------------------------------------불량코드관리------------------------------------------------
//불량코드조회
router.get('/standard/defect', async(req,resp)=>{
  let datas =req.query;
  let result = await standardService.defectSelect(datas);
  resp.send(result);
})
//불량코드등록
router.post('/standard/insertDefect', async(req,res)=>{
  let defects = req.body;
  let result = await standardService.insertDefect(defects);
  res.send(result);
});

//불량코드수정
router.put('/standard/updateDefect/:def_cd', async(req, res)=>{
  let defCd = req.params.def_cd;
  let updateInfo =req.body;
  let result = await standardService.updateDefect(defCd, updateInfo);
  res.send(result);
});
//불량코드삭제
router.delete('/standard/delDefect/:def_cd', async(req,res)=>{
  let defCd = req.params.def_cd;
  let result = await standardService.deleteDefect(defCd);
  res.send(result);
})

//-------------------------------------사원관리------------------------------------------------
//사원등록
router.post('/standard/insertMember', async(req,res)=>{
  let members = req.body;

  members.birth = members.birth == '' ? null : members.birth;
  members.quit_dt = members.quit_dt == '' ? null : members.quit_dt;

  let result = await standardService.insertMember(members);
  res.send(result);
});

//사원수정
router.put('/standard/updateMember/:mem_cd', async(req, res)=>{
  let memCd = req.params.mem_cd;
  let updateInfo =req.body;

  updateInfo.birth = updateInfo.birth == '' ? null : updateInfo.birth;
  updateInfo.quit_dt = updateInfo.quit_dt == '' ? null : updateInfo.quit_dt;

  let result = await standardService.updateMember(memCd, updateInfo);
  res.send(result);
});

//부서
router.get('/standard/dptSelect', async(req,res)=>{
  let departments = req.body;
  let result = await standardService.selectDept(departments);
  res.send(result);
})
module.exports = router;
