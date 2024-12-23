<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <!-- 헤더 -->
      <div class="card-header bg-light d-flex justify-content-center align-items-center">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <div class="input-group">
            <input id="eqp_cd" type="text" placeholder="설비코드" class="form-control" aria-label="설비코드"
              aria-describedby="button-addon2" style="height: 41px" v-model="selectedEqp" @click="modalOpen" />
            <button class="btn btn-warning" id="button-addon2" type="button" @click="modalOpen">
              SEARCH
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
                  :disabled="isFieldDisabled(field.value)" />
              </template>
            </div>
          </div>

          <!-- 오른쪽 입력란 -->
          <div class="col-lg-5 col-md-5 col-sm-12">
            <div v-for="(field, index) in rightFields" :key="index" class="mb-2">
              <label class="form-control-label">{{ field.label }}</label>
              <template v-if="field.value === 'notes'">
                <textarea v-model="formData[field.value]" rows="5" class="form-control custom-width fixed-notes"
                  :readonly="!selectedEqp"></textarea>
              </template>
              <template v-else>
                <input v-model="formData[field.value]" :type="field.type" class="form-control custom-width"
                  :readonly="!selectedEqp" />
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
      formData: {
        start_date: '',
        eqp_type: '',
        eqp_nm: '',
        model: '',
        insp_type: '',
        insp_reason: '',
        cycle: '',
        end_date: '',
        isnp_result: '',
        actions: '',
        notes: '',
        inspector: '',
      },
      equipmentData: {
        //이미지 경로
        img_path: '',
        // 입력 데이터 값
        eqp_type: '',
        eqp_nm: '',
        model: '',
        pur_dt: '',
        pur_act: '',
        mfg_act: '',
        repl_cycle: '',
        insp_cycle: '',
        id: '',
        opt_temp: '',
        opt_humid: '',
        opt_rpm: '',
        opt_speed: '',
        opt_power: '',
        uph: '',
        is_use: '',
      },
      equipDefs: [
        { headerName: '설비 코드', field: 'eqp_cd', sortable: true },
        { headerName: '설비 구분', field: 'eqp_type', sortable: true },
        { headerName: '설비명', field: 'eqp_nm', sortable: true },
        { headerName: '모델명', field: 'model', sortable: true },
      ],
      equipData: [],
      leftFields: [
        { label: '점검 시작일', value: 'start_time', type: 'date' },
        { label: '설비 구분 *', value: 'eqp_type', type: 'text' },
        { label: '설비명 *', value: 'eqp_nm', type: 'text' },
        { label: '모델명 *', value: 'model', type: 'text' },
        { label: '점검 구분', value: 'insp_type', type: 'text' },
        { label: '점검 사유', value: 'insp_reason', type: 'text' },
        { label: '점검주기 (일)', value: 'insp_cycle', type: 'number' },
      ],
      rightFields: [
        { label: '점검 종료일', value: 'end_time', type: 'date' },
        { label: '점검 판정', value: 'insp_result', type: 'text' },
        { label: '조치 사항', value: 'insp_action', type: 'text' },
        { label: '비고', value: 'note', type: 'textarea' },
        { label: '점검담당자', value: 'id', type: 'text' },
      ],
    };
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
        this.formData = result.data;

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
      this.formData = {
        start_date: '',
        eqp_type: '',
        eqp_nm: '',
        model: '',
        insp_type: '',
        insp_reason: '',
        cycle: '',
        end_date: '',
        result: '',
        actions: '',
        notes: '',
        inspector: '',
      };
      this.selectedFile = null;
      this.previewImage = require('@/assets/img/blank_img.png');
      this.selectedEqp = '';

      Swal.fire({
        icon: 'info',
        title: '초기화 완료',
        text: '입력 폼이 초기화되었습니다.',
      });
    },
    isFieldDisabled(fieldName) {
      const alwaysDisabled = ['eqp_type', 'eqp_nm', 'model'];
      return alwaysDisabled.includes(fieldName);
    },
  },

  created() {
    this.getEquipList();

    // 페이지 제목 저장
    this.$store.dispatch('breadCrumb', { title: '설비 점검 관리' });
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
