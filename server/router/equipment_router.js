const express = require("express");
const router = express.Router();
const equipmentService =  require('../service/equipment_service.js');
// const multer = require('multer');


module.exports = router;

/*--------------설비-------------*/

// 설비상태조회
router.get('/equip/stat', async (req, res)=>{
    let eqStatList = await equipmentService.findStatEq();
    res.send(eqStatList);
});

// 설비전체조회
router.get('/equip/all', async (req, res)=>{
  let eqAllList = await equipmentService.findAllEq();
  res.send(eqAllList);
});

// 설비등록
router.post('/equip/all', async (req, res)=>{
  let eqInfo = req.body;
  let result = await equipmentService.insertEq(eqInfo);
  res.send(result);
});