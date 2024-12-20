const express = require('express');
const router = express.Router();
const equipmentService = require('../service/equipment_service.js');
const multer = require('multer');
const path = require('path');

// multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 파일 저장 디렉토리 설정
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
router.get('/equip/stat', async (req, res) => {
  let eqStatList = await equipmentService.findStatEq();
  res.send(eqStatList);
});

// 설비 전체 조회
router.get('/equip', async (req, res) => {
  let eqAllList = await equipmentService.findAllEq();
  res.send(eqAllList);
});

// 필터링된 설비 전체 조회
router.get('/equipFiltered', async (req, res) => {
  try {
    const filters = req.query; // 클라이언트에서 전달된 필터링 조건
    const result = await equipmentService.getFilteredEq(filters); // 필터링된 서비스 호출
    res.json(result);
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
    if (!req.file) {
      throw new Error('파일 업로드가 실패했습니다.');
    }

    const imgPath = `/uploads/${req.file.filename}`; // 업로드된 파일 경로
    const eqInfo = { ...req.body, img_path: imgPath };

    Object.keys(eqInfo).forEach((key) => {
      if (
        eqInfo[key] === undefined ||
        eqInfo[key] === 'null' ||
        eqInfo[key] === ''
      ) {
        delete eqInfo[key]; // 빈 값 제거
      }
    });

    // DB 저장(서비스 함수 호출)
    const result = await equipmentService.insertEq(eqInfo);

    //결과 반환
    res.json({ success: true, data: result, img_path: imgPath });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: '설비 등록 실패' });
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

module.exports = router;
// module.exports = upload;
