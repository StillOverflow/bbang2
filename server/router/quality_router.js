const express = require("express");
const router = express.Router();
const qualityService = require("../service/quality_service.js");

// 검사항목
// 미적용 검사항목 조회
router.get('/quality/test/yet', async (req, resp) => {
  let values = [req.query.type, req.query.cd];
  let result = await qualityService.getYetList(values);
  resp.send(result);
});

// 적용 검사항목 조회
router.get('/quality/test/my', async (req, resp) => {
  let values = [req.query.type, req.query.cd];
  let result = await qualityService.getMyList(values);
  resp.send(result);
});

// 전체 검사항목 조회
router.get('/quality/test/all', async (req, resp) => {
  let val = null;
  // axios에서 '링크', {params: valueObj} 식으로 넘겨준 값을 req.query로 받음.
  // 조건이 있으면 검색기능, 없으면 전체조회 기능 수행
  if(req.query != null) val = req.query; 
  let result = await qualityService.findTestList(val);
  resp.send(result);
});


// 품질기준
// 등록
router.post('/quality/std', async (req, resp) => {
  let values = req.body; // body: 배열로 값을 받음.

  let result = await qualityService.stdInsert(values);
  console.log('트랜잭션 결과: ' + result);
  resp.send(result);
});


// 자재, 공정, 제품 전체 조회 (모달용)
router.get('/quality/targetAll', async (req, resp) => {
  let valueObj = req.query; // query: 객체로 값을 받음.
  let result = await qualityService.searchAll(valueObj);
  resp.send(result);
});


module.exports = router;
