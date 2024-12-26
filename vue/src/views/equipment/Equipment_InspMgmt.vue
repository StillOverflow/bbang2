<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <!-- 헤더 -->
      <div class="card-header bg-light d-flex justify-content-center align-items-center">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <div class="input-group">
            <input id="eqp_cd" type="text" placeholder="설비코드" class="form-control" aria-label="설비코드"
              @click="modalOpen" />
            <button class="btn btn-warning" id="button-addon2" type="button" @click="modalOpen">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 본문 -->
      <div class="card-body">
        <div class="row">
          <!-- 이미지 -->
          <div class="col-lg-2 col-md-2 col-sm-12 text-center">
            <img :src="previewImage" alt="설비 이미지" name="selectedFile" class="mb-3 imgBSJ" width="230" height="230" />
            <input type="file" class="form-control" disabled />
          </div>

          <!-- 왼쪽 입력란 -->
          <div class="col-lg-5 col-md-5 col-sm-12">
            <div v-for="(field, index) in leftFields" :key="index" class="mb-2">
              <template v-if="field.value == 'eqp_type' || field.value == 'insp_type' || field.value == 'insp_reason'">
                <label class="form-control-label">{{ field.label }}</label>
                <select class="form-select custom-width" v-model="equipmentData[field.value]"
                  :disabled="isFieldDisabled(field.value)">
                  <option v-for="(opt, idx) in field.selectOptions" :key="idx" :value="opt.item">
                    {{ opt.name }}
                  </option>
                </select>
              </template>
              <template v-else>
                <label class="form-control-label">{{ field.label }}</label>
                <input v-model="equipmentData[field.value]" :type="field.type" class="form-control custom-width"
                  :min="currentDateTime" @change="validateStartTime" :disabled="isFieldDisabled(field.value)" />
              </template>
            </div>
          </div>



          <!-- 오른쪽 입력란 -->
          <div class="col-lg-5 col-md-5 col-sm-12">
            <div v-for="(field, index) in rightFields" :key="index" class="mb-2">
              <template v-if="field.value === 'note'">
                <label class="form-control-label">{{ field.label }}</label>
                <textarea v-model="equipmentData[field.value]" rows="5" class="form-control custom-width fixed-notes"
                  :readonly="!selectedEqp"></textarea>
              </template>
              <template v-else-if="field.value == 'insp_result'">
                <label class="form-control-label">{{ field.label }}</label>
                <select class="form-select custom-width" v-model="equipmentData[field.value]"
                  :disabled="isFieldDisabled(field.value)">
                  <option v-for="(opt, idx) in field.selectOptions" :key="idx" :value="opt.item">
                    {{ opt.name }}
                  </option>
                </select>
              </template>
              <template v-else>
                <label class="form-control-label">{{ field.label }}</label>
                <input v-model="equipmentData[field.value]" :type="field.type" class="form-control custom-width"
                  :min="equipmentData.start_time || currentDateTime" :readonly="!selectedEqp"
                  @change="validateEndTime" />
              </template>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="text-center mt-3">
          <button class="btn btn-success mlp10" @click="submitForm" :disabled="!selectedEqp">
            SAVE
          </button>
          <button class="btn btn-secondary mlp10" @click="resetForm" :disabled="!selectedEqp">
            RESET
          </button>
        </div>
      </div>
    </div>

    <!-- 모달 -->
    <Transition name="fade">
      <Layout :modalCheck="isModal">
        <template v-slot:header>
          <h5 class="modal-title">설비 코드 검색</h5>
          <button type="button" aria-label="Close" class="close" @click="modalOpen">
            ×
          </button>
        </template>
        <template v-slot:default>
          <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px" :columnDefs="equipDefs"
            :rowData="equipData" :pagination="true" @rowClicked="modalClicked"
            overlayNoRowsTemplate="등록된 설비가 없습니다."></ag-grid-vue>
        </template>
        <template v-slot:footer>
          <button type="button" class="btn btn-secondary" @click="modalOpen">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="modalOpen">
            OK
          </button>
        </template>
      </Layout>
    </Transition>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import Layout from '../components/modalLayout.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  components: { AgGridVue, Layout },
  name: 'EquipmentInspection',
  data() {
    return {
      selectedEqp: '',
      previewImage: require('@/assets/img/blank_img.png'),
      selectedFile: null,
      isModal: false,
      equipInfo: {},
      equipmentData: {
        //이미지 경로
        img_path: '',
        // 입력 데이터 값
        start_time: '',
        eqp_type: '',
        eqp_nm: '',
        insp_type: '',
        last_insp_dt: '',
        insp_reason: '',
        insp_cycle: '',
        end_time: '',
        insp_result: '',
        insp_action: '',
        note: '',
        id: '',
      },
      equipDefs: [
        { headerName: '설비 코드', field: 'eqp_cd', sortable: true },
        { headerName: '설비 구분', field: 'eqp_type', sortable: true },
        { headerName: '설비명', field: 'eqp_nm', sortable: true },
        { headerName: '모델명', field: 'model', sortable: true },
      ],
      equipData: [],
      leftFields: [
        { label: '점검 시작 일시', value: 'start_time', type: 'datetime-local', },
        { label: '설비 구분 *', value: 'eqp_type', type: 'text' },
        { label: '설비명 *', value: 'eqp_nm', type: 'text' },
        { label: '점검 구분', value: 'insp_type', type: 'text' },
        { label: '점검 사유', value: 'insp_reason', type: 'text' },
        { label: '마지막 점검일', value: 'last_insp_dt', type: 'date' },
        { label: '점검주기 (일)', value: 'insp_cycle', type: 'number' },
      ],
      rightFields: [
        { label: '점검 종료 일시', value: 'end_time', type: 'datetime-local' },
        { label: '점검 판정', value: 'insp_result', type: 'text' },
        { label: '조치 사항', value: 'insp_action', type: 'text' },
        { label: '비고', value: 'note', type: 'textarea' },
        { label: '점검담당자', value: 'id', type: 'text' },
      ],
    };
  },


  computed: {
    // 현재 날짜와 시간을 반환
    currentDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${date}T${hours}:${minutes}`;
    },
  },


  methods: {
    gridFit(params) {
      // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
      params.api.sizeColumnsToFit();
    },
    modalOpen() {
      this.isModal = !this.isModal;
    },
    modalClicked(params) {
      this.getEquipInfo(params.data.eqp_cd);
      this.selectedEqp = params.data.eqp_cd;
      this.isModal = !this.isModal;

      // 이미지 로드
      this.previewImage = params.data.img_path
        ? `/api/${params.data.img_path}`
        : require('@/assets/img/blank_img.png');

      this.isModal = false;
    },
    // 시작시간 유효성 검사
    validateStartTime() {
      if (this.equipmentData.start_time < this.currentDateTime) {
        Swal.fire({
          icon: 'error',
          title: '유효성 검사 실패',
          text: '시작시간은 현재 시간 이후로 설정해야 합니다.',
        });
        this.equipmentData.start_time = '';
      }
    },

    // 종료시간 유효성 검사
    validateEndTime() {
      if (this.equipmentData.end_time < this.equipmentData.start_time) {
        Swal.fire({
          icon: 'error',
          title: '유효성 검사 실패',
          text: '종료시간은 시작시간 이후로 설정해야 합니다.',
        });
        this.equipmentData.end_time = '';
      }
    },

    async getComm(cd) {
      // 공통코드 가져오기
      let result = await axios
        .get('/api/comm/codeList/' + cd)
        .catch((err) => console.log(err));
      return result.data;
    },


    // 설비 단건 조회
    async getEquipInfo(eqp_cd) {
      let result = await axios
        .get(`api/equip/${eqp_cd}`)
        .catch((err) => console.log(err));

      if (result.data) {
        // 날짜 필드 스플릿
        if (result.data.pur_dt) {
          result.data.pur_dt = result.data.pur_dt.split('T')[0]; // 'T' 앞의 날짜만 추출
        }
        this.equipmentData = result.data;

        // 이미지 경로 처리
        this.previewImage = result.data.img_path
          ? `/api/${result.data.img_path}`
          : require('@/assets/img/blank_img.png');
      }
    },

    // 설비 전체 조회
    async getEquipList() {
      let result = await axios
        .get(`/api/equip`)
        .catch((err) => console.log(err));
      this.equipData = result.data; // 서버가 실제로 보낸 데이터
    },

    submitForm() {
      if (!this.selectedEqp) {
        Swal.fire({
          icon: 'error',
          title: '오류',
          text: '설비코드를 선택해주세요.',
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: '등록 완료',
        text: '점검 정보가 성공적으로 등록되었습니다.',
      });
    },
    resetForm() {
      this.isEditMode = false; // 수정 모드 종료
      this.selectedEqp = ''; // 설비 코드 입력란 초기화
      this.selectedFile = null; // 선택된 파일 초기화
      this.previewImage = require('@/assets/img/blank_img.png'); // 기본 이미지로 초기화

      // 입력 필드 초기화
      Object.keys(this.equipmentData).forEach((key) => {
        this.equipmentData[key] = '';
      });

      Swal.fire({
        icon: 'info',
        title: '초기화 완료',
        text: '입력 폼이 초기화되었습니다.',
      });
    },
    isFieldDisabled(fieldName) {
      const alwaysDisabled = ['eqp_type', 'eqp_nm', 'model', 'insp_cycle'];
      return !this.selectedEqp || alwaysDisabled.includes(fieldName);
    },
  },

  created() {
    this.getEquipList();
    // 페이지 제목 저장
    this.$store.dispatch('breadCrumb', { title: '설비 점검 관리' });
    this.equipmentData.start_time = this.currentDateTime;

    // 공통코드가 EQ(설비구분)일 때
    this.getComm('EQ')
      .then((result) => {
        //selectOptions에 담아 select 박스에 활용
        this.leftFields.find(
          (field) => field.value === 'eqp_type'
        ).selectOptions = result.map((item) => ({
          item: item.comm_dtl_cd,
          name: item.comm_dtl_nm,
        }));
      })
      .catch((err) => console.log(err));

    // 공통코드가 EI(점검구분)일 때
    this.getComm('EI')
      .then((result) => {
        //selectOptions에 담아 select 박스에 활용
        this.leftFields.find(
          (field) => field.value === 'insp_type'
        ).selectOptions = result.map((item) => ({
          item: item.comm_dtl_cd,
          name: item.comm_dtl_nm,
        }));
      })
      .catch((err) => console.log(err));

    // 공통코드가 EX(점검사유)일 때
    this.getComm('EX')
      .then((result) => {
        //selectOptions에 담아 select 박스에 활용
        this.leftFields.find(
          (field) => field.value === 'insp_reason'
        ).selectOptions = result.map((item) => ({
          item: item.comm_dtl_cd,
          name: item.comm_dtl_nm,
        }));
      })
      .catch((err) => console.log(err));

    // 공통코드가 EJ(점검판정)일 때
    this.getComm('EJ')
      .then((result) => {
        //selectOptions에 담아 select 박스에 활용
        this.rightFields.find(
          (field) => field.value === 'insp_result'
        ).selectOptions = result.map((item) => ({
          item: item.comm_dtl_cd,
          name: item.comm_dtl_nm,
        }));
      })
      .catch((err) => console.log(err));

  },

  watch: {
    // 감시자
    selectedEqp() {
      // 기존 설비 코드를 선택한 경우 해당 설비를 기준으로 단건조회

      // 해당 설비 : this.selectedEqp

      if (!this.selectedEqp) {
        this.isEditMode = false; // 수정모드 비활성화
        return;
      }
      this.getEquipInfo(this.selectedEqp);
      this.isEditMode = true; // 조회 시 수정 모드 활성화
    },

    // start_time 변경 감지
    'equipmentData.start_time'(newStartTime) {
      const start = new Date(newStartTime);
      const end = new Date(this.equipmentData.end_time);

      // 종료 시간이 시작 시간보다 이전일 경우 초기화
      if (this.equipmentData.end_time && end < start) {
        this.equipmentData.end_time = '';
        Swal.fire({
          icon: 'warning',
          title: '알림',
          text: '종료 시간이 시작 시간보다 빠를 수 없습니다. 종료 시간을 다시 설정해주세요.',
        });
      }
    },
  },


};


</script>

<style scoped>
.fade-enter-from {
  transform: translateY(-1000px);
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter-to {
  transform: translateY(0px);
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-active {
  transition: all 0.7s;
}

.fade-leave-to {
  opacity: 0;
}

.modal-container {
  width: 700px;
}

label {
  font-weight: bold;
}

button {
  white-space: nowrap;
}

.custom-width {
  max-width: 500px;
  width: 100%;
  height: 40px;
}

.form-control,
.form-select {
  max-width: 500px;
  width: 100%;
}

.imgBSJ {
  border-radius: 5px;
}

.fixed-notes {
  width: 100%;
  height: 200px;
}

@media (max-width: 992px) {
  .form-control .form-select .custom-width {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .w-20 {
    flex: 0 0 100%;
    max-width: 50%;
  }
}
</style>
