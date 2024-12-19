const express = require("express");
const router = express.Router();
const qualityService = require("../service/quality_service.js");

// 검사항목
// 미적용 검사목록 조회
router.get('/quality/test/yet', async (req, resp) => {
  let val = req.query;
  let result = await qualityService.getYetList(val.cd);
  resp.send(result);
});

// 적용 검사목록 조회
router.get('/quality/test/my', async (req, resp) => {
  let val = req.query;
  let result = await qualityService.getMyList(val.cd);
  resp.send(result);
});

// 전체 검사목록 조회
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
  let values = req.body; // body: 객체 또는 배열로 값을 받을 수 있음

  let result = await qualityService.stdInsert(values);
  console.log('라우터결과: ' + result); // 비동기함수가 중첩되어 어떻게 해도 결과가 안 받아와지는 문제....
  resp.send(result);
});


module.exports = router;
