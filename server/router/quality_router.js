const express = require("express");
const router = express.Router();
const qualityService = require("../service/quality_service.js");

// 검사항목

router.get('/quality/test/yet', async (req, resp) => {
  let val = req.query;
  let result = await qualityService.getYetList([val.type, val.cd]);
  resp.send(result);
});

router.get('/quality/test/my', async (req, resp) => {
  let val = req.query;
  let result = await qualityService.getMyList([val.type, val.cd]);
  resp.send(result);
});

router.get('/quality/test/all', async (req, resp) => {
  let val = null;
  if(req.query != null) val = req.query; // axios에서 '링크', {params: valueObj} 식으로 넘겨준 값을 req.query로 받음.
  let result = await qualityService.findTestList(val);
  resp.send(result);
});


// 품질기준

router.post('/quality/std', async (req, resp) => {
  let values = req.body; // 객체 또는 배열로 값을 받을 수 있음
  console.log(values);
  let result = await qualityService.stdInsert(values);
  resp.send(result);
});


module.exports = router;
