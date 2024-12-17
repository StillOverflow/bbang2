const express = require('express');
const router = express.Router();
const equipmentService = require('../service/equipment_service.js');
// const multer = require('multer');

module.exports = router;

/*--------------설비-------------*/

// 설비 상태 조회
router.get('/equip/stat', async (req, res) => {
  let eqStatList = await equipmentService.findStatEq();
  res.send(eqStatList);
});

// 설비 전체 조회
router.get('/equip', async (req, res) => {
  let eqAllList = await equipmentService.findAllEq();
  res.send(eqAllList);
});

//설비 단건 조회
router.get('/equip/:no', async (req, res) => {
  let equipNo = req.params.no;
  let info = await equipmentService.findEquipNo(equipNo);
  res.send(info);
});

// 설비등록
router.post('/equip', async (req, res) => {
  let eqInfo = req.body;
  let result = await equipmentService.insertEq(eqInfo);
  res.send(result);
});
