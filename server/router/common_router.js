const express = require('express');
const router = express.Router();
const commonService =  require('../service/common_service.js');

// QQQ01 중 'QQQ'와 관련된 공통코드를 모두 찾을 때
router.get('/comm/codeList/:cd', async (req, resp) => {
  let result = await commonService.findCommList(req.params.cd);
  resp.send(result);
});

//! 거래처 조회 => queryString 방식 ~~
// /comm/account?act_cd=A01&act_nm=가나다
router.get('/comm/account', async (req, resp) => {
  let datas = req.query; // { }
  console.log("account => ", datas);
  let result = await commonService.accountSelect(datas);
  
  resp.send(result);
});

//! 자재 조회 => queryString 방식 ~~
router.get('/comm/material', async (req, resp) => {
  let datas = req.query; // { }
  console.log("material => ", datas);
  let result = await commonService.materialSelect(datas);
  
  resp.send(result);
});

//! 상품 조회 => queryString 방식 ~~
router.get('/comm/product', async (req, resp) => {
  let datas = req.query; // { }
  console.log("material => ", datas);
  let result = await commonService.productSelect(datas);
  
  resp.send(result);
});

module.exports = router;