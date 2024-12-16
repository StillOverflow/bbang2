const express = require('express');
const router = express.Router();
const commonService =  require('../service/common_service.js');

// 정확히 특정 공통코드를 찾을 때
router.get('/comm/:cd', async (req, resp) => {
  let result = await commonService.findComm(req.params.cd);
  resp.send(result);
});

// QQQ01 중 'QQQ'와 관련된 공통코드를 모두 찾을 때
router.get('/commList/:cd', async (req, resp) => {
  let result = await commonService.findCommList(req.params.cd);
  resp.send(result);
});


module.exports = router;