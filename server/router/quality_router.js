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
  let values = [req.query.cd, req.query.type, req.query.cd];
  let result = await qualityService.getMyList(values);
  resp.send(result);
});

// 해당 품질기준에 속한 검사항목 조회 (검사결과목록에서 조회용)
router.get('/quality/test/std/:stdCd', async (req, resp) => {
  let result = await qualityService.getStdTestList([req.params.stdCd]);
  resp.send(result);
});

// 전체 검사항목 조회+검색
router.get('/quality/test/all', async (req, resp) => {
  let valueObj = req.query;
  let result = await qualityService.findTestList(valueObj);
  resp.send(result);
});

// 검사항목 수정(단건)
router.put('/quality/test/all/:cd', async (req, resp) => {
  let values = [req.body, req.params.cd];
  let result = await qualityService.updateTest(values);
  resp.send(result);
});

// 검사항목 수정(일괄)
router.put('/quality/test/all/', async (req, resp) => {
  let values = req.body;
  let result = await qualityService.updateTestAll(values);
  resp.send(result);
});

// 검사항목 삭제
router.delete('/quality/test/all/:cd', async (req, resp) => {
  let value = req.params.cd;
  let result = await qualityService.deleteTest(value);
  resp.send(result);
});

// 검사항목 추가
router.post('/quality/test', async (req, resp) => {
  let valueObj = req.body;
  let result = await qualityService.insertTest(valueObj);
  resp.send(result);
});


// 품질기준
// 등록
router.post('/quality/std', async (req, resp) => {
  let values = req.body; // body: 배열/객체로 값을 받음.
  let result = await qualityService.stdInsert(values);
  resp.send(result);
});


// 자재, 공정, 제품 전체 조회 (모달용)
router.get('/quality/targetAll', async (req, resp) => {
  let valueObj = req.query; // query: 객체로 값을 받음.
  let result = await qualityService.searchAll(valueObj);
  resp.send(result);
});


// 품질검사결과
// 검사대기 내역 조회 (생산지시상태 완료 상태 내역을 가져옴(검사대기) => 검사완료 후 다음 공정이 있다면 진행전 상태로 넘겨줌)
router.get('/quality/rec/wait/prd', async (req, resp) => {
  let result = await qualityService.getWaitPrdList();
  resp.send(result);
});

// 자재 검사대기 내역 조회
router.get('/quality/rec/wait/mat/:actCd', async (req, resp) => {
  let value = req.params.actCd;
  let result = await qualityService.getWaitMatList(value);
  resp.send(result);
});

// 자재 미입고 거래처조회 (모달용)
router.get('/quality/rec/wait/act', async (req, resp) => {
  let result = await qualityService.getActList();
  resp.send(result);
});

// 타입별 불량조회 (모달용)
router.get('/quality/defect', async (req, resp) => {
  let valueObj = req.query; // query: 객체로 값을 받음.
  let result = await qualityService.getDefList(valueObj);
  resp.send(result);
});

// 검사결과 등록
router.post('/quality/rec', async (req, resp) => {
  let valueObj = req.body; // 객체로 값을 받음. {header: ..., dtl: [...]} 형태
  let result = await qualityService.testRecInsert(valueObj);
  resp.send(result);
});


// 검사결과내역 조회+검색
router.get('/quality/rec', async (req, resp) => {
  let valueObj = req.query; // query: 객체로 값을 받음.
  let result = await qualityService.getTestRecList(valueObj);
  resp.send(result);
});

// 검사결과 상세내역 (샘플링검사의 측정값) 조회
router.get('/quality/rec/dtl', async (req, resp) => {
  let value = req.query.test_rec_cd; // query: 객체로 값을 받음.
  let result = await qualityService.getTestDtl(value);
  resp.send(result);
});


// 불량 처리
router.put('/quality/rec/:cd', async (req, resp) => {
  let valueObj = req.body;
  let result = await qualityService.updateDefStatus([valueObj, req.params.cd]);
  resp.send(result);
});


module.exports = router;
