const express = require("express");
const router = express.Router();
const qualityService = require("../service/quality_service.js");

// 검사항목
router.get('/quality/test', async (req, resp) => {
  let value = req.body;
  let result = await qualityService.findTestList(value);
  resp.send(result);
});


// 품질기준
router.post('/quality/std', async (req, resp) => {
  let value = req.body;
  let result = await qualityService.stdInsert(value);
  resp.send(result);
});


module.exports = router;
