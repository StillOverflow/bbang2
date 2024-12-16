<!-- 설비 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div
        class="card-header bg-light d-flex justify-content-center align-items-center"
      >
        <div class="d-flex align-items-center gap-2 w-20">
          <div class="input-group">
            <input
              v-model="searchCode"
              type="text"
              placeholder="설비코드"
              class="form-control"
              style="height: 40px"
            />
            <button class="btn btn-secondary" @click="fetchEquipment">
              조회
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- 이미지 -->
          <div class="col-lg-2 col-md-2 col-sm-12 text-center">
            <img
              :src="previewImage"
              alt="설비 이미지"
              class="mb-3 imgBSJ"
              width="230"
              height="230"
            />
            <input type="file" class="form-control" @change="onFileChange" />
          </div>
          <!-- 왼쪽 입력란 -->
          <div class="col-lg-5 col-md-5 col-sm-12">
            <div v-for="(field, index) in leftFields" :key="index" class="mb-2">
              <label class="form-control-label">{{ field.label }}</label>
              <input
                v-model="equipmentData[field.value]"
                :type="field.type"
                class="form-control custom-width"
              />
            </div>
          </div>
          <!-- 오른쪽 입력란 -->
          <div class="col-lg-5 col-md-12 col-sm-12">
            <div
              v-for="(field, index) in rightFields"
              :key="index"
              class="mb-2"
            >
              <label class="form-control-label">{{ field.label }}</label>
              <input
                v-model="equipmentData[field.value]"
                :type="field.type"
                class="form-control custom-width"
              />
            </div>
          </div>
        </div>
        <!-- 버튼 -->
        <div class="text-center mt-3">
          <button class="btn btn-success me-2" @click="registerEquipment">
            등록
          </button>
          <button class="btn btn-danger" @click="resetForm">초기화</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'EquipmentRegister',
  data() {
    return {
      imagePreview: require('@/assets/img/blank_img.png'), // 이미지 미리보기 경로
      selectedFile: null, // 선택한 파일일
      searchCode: '', // 검색 입력값
      equipmentData: {
        //이미지 경로
        imagePath: '',
        // 입력 데이터 값
        eqpType: '',
        eqpName: '',
        model: '',
        purDate: '',
        purAct: '',
        mfgAct: '',
        replCycle: '',
        inspCycle: '',
        eqpMgr: '',
        optTemp: '',
        optHumid: '',
        optRpm: '',
        optSpeed: '',
        optPower: '',
        uph: '',
        status: '',
        isUse: '',
      },
      leftFields: [
        { label: '설비구분 *', value: 'eqpType', type: 'text' },
        { label: '설비명 *', value: 'eqpName', type: 'text' },
        { label: '모델명 *', value: 'model', type: 'text' },
        { label: '구매일자', value: 'purDate', type: 'date' },
        { label: '구매업체', value: 'purAct', type: 'text' },
        { label: '제조업체', value: 'mfgAct', type: 'text' },
        { label: '교체주기 (년)', value: 'replCycle', type: 'number' },
        { label: '점검주기 (개월)', value: 'inspCycle', type: 'number' },
        { label: '설비담당자', value: 'eqpMgr', type: 'text' },
      ],
      rightFields: [
        { label: '적정 온도', value: 'optTemp', type: 'text' },
        { label: '적정 습도', value: 'optHumid', type: 'text' },
        { label: '적정 RPM', value: 'optRpm', type: 'text' },
        { label: '적정 속도', value: 'optSpeed', type: 'text' },
        { label: '적정 전력량', value: 'optPower', type: 'text' },
        { label: 'UPH', value: 'uph', type: 'text' },
        { label: '점검구분', value: 'status', type: 'text' },
        { label: '설비상태', value: 'isUse', type: 'text' },
      ],
    };
  },
  methods: {
    //파일 업로드 핸들러
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file; // 파일 객체 저장장
        this.imagePreview = URL.createObjectURL(file); // 미리보기 서렂ㅇ
      }
    },

    // 설비 조회
    fetchEquipment() {
      console.log('조회: ', this.searchCode);
    },

    // 등록 기능
    async registerEquipment() {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('equipmentData', JSON.stringify(this.equipmentData));

      try {
        const response = await axios.post('/api/equip/all', formData);
        console.log(response.data);
      } catch (error) {
        console.error('등록 실패:', error);
        alert('등록 중 오류가 발생했습니다.');
      }
    },
    // 초기화
    resetForm() {
      Object.keys(this.equipmentData).forEach((key) => {
        this.equipmentData[key] = '';
      });
    },
  },
  created() {
    // 페이지 제목 저장
    this.$store.dispatch('breadCrumb', { title: '설비 관리' });
  },
};
</script>

<style scoped>
label {
  font-weight: bold;
}
button {
  white-space: nowrap;
}
.custom-width {
  max-width: 500px;
  width: 100%;
}
.imgBSJ {
  border-radius: 10px;
}
@media (max-width: 1730px) {
  .col-md-5,
  .col-md-2,
  .form-control {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .w-20 {
    flex: 0 0 100%;
    max-width: 50%;
  }
}
</style>
