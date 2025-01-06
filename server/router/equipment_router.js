const express = require('express');
const router = express.Router();
const equipmentService = require('../service/equipment_service.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = 'uploads/';

// multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // uploads 디렉토리가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // 하위 디렉토리까지 재귀적으로 생성
      console.log(`'${uploadDir}' 디렉토리가 생성되었습니다.`);
    }
    cb(null, uploadDir); // 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    const now = new Date(); // 현재 시간 객체
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
    const date = String(now.getDate()).padStart(2, '0'); // 날짜
    const hours = String(now.getHours()).padStart(2, '0'); // 시간
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 분
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 초

    const timestamp = `${year}${month}${date}_${hours}${minutes}${seconds}`; // YYYYMMDD_HHmmss
    const originalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    ); // 한글 깨짐 방지
    cb(null, `${timestamp}_${originalName}`); // 최종 파일명 설정
  },
});

// 파일 필터링 및 크기 제한 설정
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB 크기 제한
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpeg', '.png', '.jpg'].includes(ext)) {
      return cb(new Error('지원하지 않는 파일 형식입니다.'), false);
    }
    cb(null, true);
  },
});

/*--------------설비-------------*/

// 설비 상태 조회
router.get('/equipList/stat', async (req, res) => {
  try {
    let searchList = req.query;

    let result = await equipmentService.findStatEq(searchList);
    res.send(result);
  } catch (err) {
    console.error('필터링된 설비상태 조회 실패:', err);
    res.status(500).json({ error: '필터링된 설비상태 조회 실패' });
  }
});

// 설비 전체 조회
router.get('/equip', async (req, res) => {
  let eqAllList = await equipmentService.findAllEq();
  res.send(eqAllList);
});

// 필터링된 설비 전체 조회
router.get('/equipList/search', async (req, res) => {
  try {
    let searchList = req.query;

    let result = await equipmentService.findFilteredEq(searchList);
    res.send(result);
  } catch (err) {
    console.error('필터링된 설비 조회 실패:', err);
    res.status(500).json({ error: '필터링된 설비 조회 실패' });
  }
});

//설비 단건 조회
router.get('/equip/:no', async (req, res) => {
  let equipNo = req.params.no;
  let info = await equipmentService.findEquipNo(equipNo);
  res.send(info);
});

// 설비등록 + 파일 업로드

router.post('/equip', upload.single('selectedFile'), async (req, res) => {
  try {
    // 업로드된 파일 경로 처리 (파일이 없으면 null로 설정)
    const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

    // 요청 데이터에 이미지 경로 추가
    const eqInfo = { ...req.body, img_path: imgPath };

    // undefined, "null", 빈 문자열인 필드 제거
    Object.keys(eqInfo).forEach((key) => {
      if (
        eqInfo[key] === undefined ||
        eqInfo[key] === 'null' ||
        eqInfo[key] === ''
      ) {
        delete eqInfo[key]; // 해당 키 삭제
      }
    });

    // DB 저장 (서비스 함수 호출)
    const result = await equipmentService.insertEq(eqInfo);

    // 결과 반환
    res.json({ success: true, data: result, img_path: imgPath });
  } catch (err) {
    console.error('설비 등록 실패:', err);
    res.status(500).json({
      success: false,
      message: req.file
        ? '설비 등록 중 오류가 발생했습니다.'
        : '이미지 파일이 업로드되지 않았습니다.',
    });
  }
});

// 설비수정 + 이미지 파일도 같이 수정

router.put(
  '/equip/:eqp_cd',
  upload.single('selectedFile'),
  async (req, res) => {
    console.log('수정 요청 데이터:', req.body);
    const eqpCd = req.params.eqp_cd; // URL에서 설비 코드 추출

    try {
      // 이미지 파일 업로드 처리
      const imgPath = req.file
        ? `/uploads/${req.file.filename}` // 새 이미지 경로
        : req.body.img_path || null; // 기존 이미지 경로 유지

      // 수정할 데이터 구성
      const eqInfo = { ...req.body, img_path: imgPath, eqp_cd: eqpCd };

      // undefined, "null", 빈 문자열인 필드 제거 (쿼리에서 생략 / 명시적 null처리하면 default 못 받아오는 문제)
      Object.keys(eqInfo).forEach((key) => {
        if (
          eqInfo[key] === undefined ||
          eqInfo[key] === 'null' ||
          eqInfo[key] === ''
        ) {
          delete eqInfo[key]; // 해당 키 삭제
        }
      });

      // 서비스 호출
      const result = await equipmentService.updateEq(eqInfo);

      // 응답 반환
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch {
      console.err('수정 실패:', err);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
  }
);


/*--------------설비 점검-------------*/

//점검등록
router.post('/equip/insp', async (req, res) => {
  try {
    const inspData = req.body; // 클라이언트로부터 받은 데이터

    console.log('inspData :', inspData);

    // undefined, "null", 빈 문자열인 필드 제거
    Object.keys(inspData).forEach((key) => {
      if (
        inspData[key] === undefined ||
        inspData[key] === 'null' ||
        inspData[key] === ''
      ) {
        delete inspData[key]; // 해당 키 삭제
      }
    });
    // DB 저장 (서비스 함수 호출)
    const result = await equipmentService.insertInspEq(inspData);

    // 결과 반환
    if (result.insp_log_cd) {
      res.json({ success: true, data: result });
    }
  } catch (err) {
    console.error('점검 등록 실패:', err);
    res.status(500).json({
      success: false,
      message: '점검 등록 중 오류 발생'
    });
  }
});

// 점검수정
router.put('/equip/insp/:insp_log_cd', async (req, res) => {
  console.log('수정 요청 데이터:', req.body);

  const inspLogCd = req.params.insp_log_cd; // URL에서 점검 코드 추출

  console.log('수신한 insp_log_cd:', inspLogCd);
  console.log('수정 요청 데이터:', req.body);

  // insp_log_cd가 유효한지 확인
  if (!inspLogCd || inspLogCd === 'null' || inspLogCd.trim() === '') {
    return res.status(400).json({
      success: false,
      message: '유효하지 않은 insp_log_cd입니다. 값을 확인하세요.',
    });
  }

  try {
    // 수정할 데이터 구성
    const eqInspInfo = { ...req.body, insp_log_cd: inspLogCd };

    // undefined 및 "null"인 필드만 제거
    Object.keys(eqInspInfo).forEach((key) => {
      if (
        eqInspInfo[key] === undefined || // JavaScript의 undefined
        eqInspInfo[key] === 'null' // 문자열로 "null"
      ) {
        delete eqInspInfo[key]; // 해당 키 삭제
      }
      // 실제 null 값은 유지하여 명시적으로 처리 가능
    });

    console.log('최종 업데이트 데이터:', eqInspInfo);

    // 서비스 호출
    const result = await equipmentService.updateInspEq(eqInspInfo);

    // 결과 반환
    if (result.success) {
      res.json({ success: true, data: result.data });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error('점검 수정 실패:', err);
    res.status(500).json({
      success: false,
      message: '점검 수정 중 오류 발생',
    });
  }
});


//점검전체조회
router.get('/equipList/insp', async (req, res) => {
  try {
    let searchList = req.query;
    console.log("router query => ", searchList)
    let result = await equipmentService.findInspEq(searchList);
    res.send(result);
  } catch (err) {
    console.error('필터링된 점검 조회 실패:', err);
    res.status(500).json({ error: '필터링된 점검 조회 실패' });
  }
});

//점검단건조회
router.get('/equip/insp/:no', async (req, res) => {
  let eqpCd = req.params.no;
  let info = await equipmentService.findInspEqOne(eqpCd);
  res.send(info);
});


/*--------------설비 비가동-------------*/

//비가동 등록
router.post('/equip/down', async (req, res) => {
  try {
    const downData = req.body; // 클라이언트로부터 받은 데이터

    console.log('downData :', downData);

    // undefined, "null", 빈 문자열인 필드 제거
    Object.keys(downData).forEach((key) => {
      if (
        downData[key] === undefined ||
        downData[key] === 'null' ||
        downData[key] === ''
      ) {
        delete downData[key]; // 해당 키 삭제
      }
    });
    // DB 저장 (서비스 함수 호출)
    const result = await equipmentService.insertDownEq(downData);

    // 결과 반환
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('비가동 등록 실패:', err);
    res.status(500).json({
      success: false,
      message: '비가동 등록 중 오류 발생'
    });
  }
});

// 비가동수정
router.put('/equip/down/:downtime_cd', async (req, res) => {
  console.log('수정 요청 데이터:', req.body);

  const downLogCd = req.params.downtime_cd; // URL에서 점검 코드 추출

  console.log('수신한 downtime_cd:', downLogCd);
  console.log('수정 요청 데이터:', req.body);

  // downtime_cd가 유효한지 확인
  if (!downLogCd || downLogCd === 'null' || downLogCd.trim() === '') {
    return res.status(400).json({
      success: false,
      message: '유효하지 않은 downtime_cd입니다. 값을 확인하세요.',
    });
  }

  try {
    // 수정할 데이터 구성
    const eqDownInfo = { ...req.body, downtime_cd: downLogCd };

    // undefined 및 "null"인 필드만 제거
    Object.keys(eqDownInfo).forEach((key) => {
      if (
        eqDownInfo[key] === undefined || // JavaScript의 undefined
        eqDownInfo[key] === 'null' // 문자열로 "null"
      ) {
        delete eqDownInfo[key]; // 해당 키 삭제
      }
      // 실제 null 값은 유지하여 명시적으로 처리 가능
    });

    console.log('최종 업데이트 데이터:', eqDownInfo);

    // 서비스 호출
    const result = await equipmentService.updateDownEq(eqDownInfo);

    // 결과 반환
    if (result.success) {
      res.json({ success: true, data: result.data });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error('비가동 수정 실패:', err);
    res.status(500).json({
      success: false,
      message: '비가동 수정 중 오류 발생',
    });
  }
});


//비가동전체조회
router.get('/equip/down', async (req, res) => {
  let eqDownList = await equipmentService.findDownEq();
  res.send(eqDownList);
});

//비가동단건조회
router.get('/equip/down/:no', async (req, res) => {
  let eqpCd = req.params.no;
  let info = await equipmentService.findDownEqOne(eqpCd);
  res.send(info);
});

//비가동전체조회(필터링)
router.get('/equipList/down', async (req, res) => {
  try {
    let searchList = req.query;
    console.log("받은 쿼리 파라미터 => ", searchList)
    let result = await equipmentService.findDownEq(searchList);
    res.send(result);
  } catch (err) {
    console.error('필터링된 비가동 조회 실패:', err);
    res.status(500).json({ error: '필터링된 비가동 조회 실패' });
  }
});



/*--------------설비 수리-------------*/

//수리 등록
router.post('/equip/repair', async (req, res) => {
  try {
    const repairData = req.body; // 클라이언트로부터 받은 데이터

    console.log('repairData :', repairData);

    // undefined, "null", 빈 문자열인 필드 제거
    Object.keys(repairData).forEach((key) => {
      if (
        repairData[key] === undefined ||
        repairData[key] === 'null' ||
        repairData[key] === ''
      ) {
        delete repairData[key]; // 해당 키 삭제
      }
    });
    // DB 저장 (서비스 함수 호출)
    const result = await equipmentService.insertRepairEq(repairData);

    // 결과 반환
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('수리 등록 실패:', err);
    res.status(500).json({
      success: false,
      message: '수리 등록 중 오류 발생'
    });
  }
});

// 수리 수정
router.put('/equip/repair/:repair_cd', async (req, res) => {
  console.log('수정 요청 데이터:', req.body);

  const repairLogCd = req.params.repair_cd; // URL에서 점검 코드 추출

  console.log('수신한 repair_cd:', repairLogCd);
  console.log('수정 요청 데이터:', req.body);

  // repair_cd가 유효한지 확인
  if (!repairLogCd || repairLogCd === 'null' || repairLogCd.trim() === '') {
    return res.status(400).json({
      success: false,
      message: '유효하지 않은 repair_cd입니다. 값을 확인하세요.',
    });
  }

  try {
    // 수정할 데이터 구성
    const eqRepairInfo = { ...req.body, repair_cd: repairLogCd };

    // undefined 및 "null"인 필드만 제거
    Object.keys(eqRepairInfo).forEach((key) => {
      if (
        eqRepairInfo[key] === undefined || // JavaScript의 undefined
        eqRepairInfo[key] === 'null' // 문자열로 "null"
      ) {
        delete eqRepairInfo[key]; // 해당 키 삭제
      }
      // 실제 null 값은 유지하여 명시적으로 처리 가능
    });

    console.log('최종 업데이트 데이터:', eqRepairInfo);

    // 서비스 호출
    const result = await equipmentService.updateRepairEq(eqRepairInfo);

    // 결과 반환
    if (result.success) {
      res.json({ success: true, data: result.data });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error('수리 수정 실패:', err);
    res.status(500).json({
      success: false,
      message: '수리 수정 중 오류 발생',
    });
  }
});


//수리전체조회
router.get('/equip/repair', async (req, res) => {
  let eqRepairList = await equipmentService.findRepairEq();
  res.send(eqRepairList);
});

//수리단건조회
router.get('/equip/repair/:no', async (req, res) => {
  let eqpCd = req.params.no;
  let info = await equipmentService.findRepairEqOne(eqpCd);
  res.send(info);
});


//수리전체조회(필터링)
router.get('/equipList/repair', async (req, res) => {
  try {
    let searchList = req.query;
    console.log("받은 쿼리 파라미터 => ", searchList)
    let result = await equipmentService.findRepairEq(searchList);
    res.send(result);
  } catch (err) {
    console.error('필터링된 수리 조회 실패:', err);
    res.status(500).json({ error: '필터링된 수리 조회 실패' });
  }
});




module.exports = router;
// module.exports = upload;
