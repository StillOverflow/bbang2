const express = require('express');
const router = express.Router();
const equipmentService = require('../service/equipment_service.js');
const multer = require('multer');
const path = require('path');

// multer 설정
const storage = multer.diskStorage({
  // 디스크 저장소 정의
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // cb 콜백 함수를 통해 전송된 파일 저장 디렉터리 설정
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    ); //한글 이름 깨졌을때 추가하삼
    cb(null, new Date().valueOf() + path.basename(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 2MB 크기 제한
}); // multer 객체 생성

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

// 설비등록 + 파일 업로드

router.post('/equip', upload.single('selectedFile'), async (req, res) => {
  try {
    // 업로드된 파일 경로
    const imgPath = req.file ? `/uploads/${req.file.filename}` : null;
    console.log(imgPath);

    // 나머지 폼 데이터
    const eqInfo = { ...req.body, img_path: imgPath };

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
    try {
      const eqpCd = req.params.eqp_cd; // URL에서 설비 코드 추출

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
      res.json(result);
    } catch (err) {
      console.error('설비 수정 에러:', err.message);
      res.status(500).json({ success: false, message: '설비 수정 실패' });
    }
  }
);

module.exports = router;
