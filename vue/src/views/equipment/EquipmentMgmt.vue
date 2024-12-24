<!-- 설비 관리 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div class="card-header bg-light d-flex justify-content-center align-items-center">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <div class="input-group">
            <input id="eqp_cd" type="text" placeholder="설비코드" class="form-control" aria-label="설비코드"
              aria-describedby="button-addon2" style="height: 41px" v-model="selectedEqp" @click="modalOpen" />
            <button class="btn btn-warning" id="button-addon2" type="button" @click="modalOpen">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="row">
          <!-- 이미지 -->
          <div class="col-lg-2 col-md-2 col-sm-12 text-center">
            <!-- 프록시를 문자열로 박아넣음 배포시 replace로 삭제하기 -->
            <img :src="previewImage" alt="설비 이미지" class="mb-3 imgBSJ" name="selectedFile" width="230" height="230" />
            <input type="file" class="form-control" @change="onFileChange" />
          </div>

          <!-- 왼쪽 입력란 -->
          <div class="col-lg-5 col-md-5 col-sm-12">
            <div v-for="(field, index) in leftFields" :key="index" class="mb-2">
              <template v-if="field.value == 'eqp_type'">
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
              <template v-if="field.value == 'is_use'">
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
        </div>

        <!-- 버튼 -->
        <div class="text-center mt-3">
          <button v-if="isEditMode" class="btn btn-success mlp10" @click="equipUpdate">
            SAVE
          </button>
          <button v-if="!isEditMode" class="btn btn-success mlp10" @click="equipInsert">
            SAVE
          </button>
          <button v-if="!isEditMode" class="btn btn-secondary mlp10" @click="resetForm">
            RESET
          </button>
        </div>
      </div>
    </div>
  </div>

  <!--모달-->
  <Transition name="fade">
    <Layout :modalCheck="isModal">
      <template v-slot:header>
        <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
        <h5 class="modal-title">설비 코드 검색</h5>
        <button type="button" aria-label="Close" class="close" @click="modalOpen">
          ×
        </button>
      </template>
      <template v-slot:default>
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px" :columnDefs="equipDefs"
          :rowData="equipData" :pagination="true" @rowClicked="modalClicked" @grid-ready="gridFit"
          overlayNoRowsTemplate="등록된 설비가 없습니다.">
        </ag-grid-vue>
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
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import Layout from '../components/modalLayout.vue';

export default {
  components: { AgGridVue, Layout },
  name: 'EquipmentMgmt',
  data() {
    return {
      isEditMode: false, // 수정 모드 여부
      selectedEqp: '',
      previewImage: require('@/assets/img/blank_img.png'), // 이미지 미리보기 경로
      selectedFile: null, // 선택한 파일
      equipInfo: {},
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
        { headerName: '설비 코드', field: 'eqp_cd', sortable: true, width: 163 },
        {
          headerName: '설비 구분',
          field: 'eqp_type',
          sortable: true, width: 163
        },
        {
          headerName: '설비명',
          field: 'eqp_nm',
          sortable: true, width: 163
        },
        { headerName: '모델명', field: 'model', sortable: true, width: 163 },
      ],

      equipData: [],

      leftFields: [
        {
          label: '설비구분 *',
          value: 'eqp_type',
          type: 'text',
          selectOptions: [],
        },
        { label: '설비명 *', value: 'eqp_nm', type: 'text' },
        { label: '모델명 *', value: 'model', type: 'text' },
        { label: '구매일자', value: 'pur_dt', type: 'date' },
        { label: '구매업체', value: 'pur_act', type: 'text' },
        { label: '제조업체', value: 'mfg_act', type: 'text' },
        { label: '교체주기 (년)', value: 'repl_cycle', type: 'number' },
        { label: '점검주기 (일)', value: 'insp_cycle', type: 'number' },
      ],
      rightFields: [
        { label: '적정 온도', value: 'opt_temp', type: 'text' },
        { label: '적정 습도', value: 'opt_humid', type: 'text' },
        { label: '적정 RPM', value: 'opt_rpm', type: 'text' },
        { label: '적정 속도', value: 'opt_speed', type: 'text' },
        { label: '적정 전력량', value: 'opt_power', type: 'text' },
        { label: 'UPH', value: 'uph', type: 'text' },
        { label: '설비상태', value: 'is_use', type: 'text', selectOptions: [] },
        { label: '설비담당자', value: 'id', type: 'text' },
      ],

      isModal: false,
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
    },

    // 파일 업로드 핸들러
    onFileChange(event) {
      const file = event.target.files[0]; // 업로드된 파일 객체

      if (!file) {
        return; // 파일이 선택되지 않았으면 종료
      }

      // 파일 확장자 확인
      const validExtensions = ['jpeg', 'jpg', 'png'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        this.$swal({
          icon: 'error',
          title: '잘못된 파일 형식',
          html: `지원되지 않는 파일 형식입니다.<br>(${validExtensions.join(', ')}만 업로드 가능합니다.)`,
          confirmButtonText: '확인',
        });
        event.target.value = ''; // 업로드된 파일 초기화
        return;
      }

      // 파일 크기 제한 확인 (5MB 제한)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.$swal({
          icon: 'error',
          title: '파일 크기 초과',
          text: '5MB 이하의 파일만 업로드 가능합니다.',
          confirmButtonText: '확인',
        });
        event.target.value = ''; // 업로드된 파일 초기화
        return;
      }

      // 유효한 파일일 경우 처리
      this.selectedFile = file; // 선택한 파일 저장
      this.previewImage = URL.createObjectURL(file); // 미리보기 이미지 경로 설정
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

    isFieldDisabled(fieldName) {
      // 특정 필드 비활성화 조건
      const alwaysDisabled = ['eqp_type', 'eqp_nm', 'model'];
      return this.isEditMode && alwaysDisabled.includes(fieldName);
    },

    // 등록 기능 (for in 사용)
    async equipInsert() {
      let formData = this.getInsertData();

      try {
        let result = await axios.post('/api/equip', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        let addRes = result.data; // 서버에서 반환된 응답 처리
        if (addRes.success) {
          this.$swal({
            icon: 'success',
            title: '등록완료',
            text: '설비가 등록되었습니다.',
          });

          // 추가된 데이터를 모달에 반영
          this.equipData.push({
            eqp_cd: addRes.data.eqp_cd,
            eqp_type: this.equipmentData.eqp_type,
            eqp_nm: this.equipmentData.eqp_nm,
            model: this.equipmentData.model,
            status: this.equipmentData.status,
            create_dt: new Date().toISOString().split('T')[0], // 현재 날짜
            id: this.equipmentData.id,
          });

          this.resetForm();
        }
      } catch (err) {
        console.error('설비 등록 오류:', err);
        this.$swal({
          icon: 'error',
          title: '등록 실패',
          text: '설비 등록 중 오류가 발생했습니다.',
        });
      }
    },

    getInsertData() {
      let formData = new FormData();

      Object.keys(this.equipmentData).forEach((key) => {
        // 빈 문자열 또는 null 값은 추가하지 않음
        if (
          this.equipmentData[key] !== '' &&
          this.equipmentData[key] !== null
        ) {
          formData.append(key, this.equipmentData[key]);
        }
      });

      if (this.selectedFile) {
        formData.append('selectedFile', this.selectedFile);
      }

      return formData;
    },

    //수정
    async equipUpdate() {
      let formData = this.getInsertData();

      try {
        let response = await axios.put(
          `/api/equip/${this.selectedEqp}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        if (response.data.success) {
          this.$swal(
            '수정 완료',
            '설비 정보가 성공적으로 수정되었습니다.',
            'success'
          );
          // 상태 초기화 및 등록 모드 전환
          this.resetForm(); // 입력 필드 초기화
        } else {
          this.$swal('수정 실패', response.data.message, 'error');
        }
      } catch (err) {
        console.error('수정 오류:', err);
        this.$swal('수정 실패', '서버 오류가 발생했습니다.', 'error');
      }
    },

    // 초기화
    resetForm() {
      this.isEditMode = false; // 수정 모드 종료
      this.selectedEqp = ''; // 설비 코드 입력란 초기화
      this.selectedFile = null; // 선택된 파일 초기화
      this.previewImage = require('@/assets/img/blank_img.png'); // 기본 이미지로 초기화

      // 입력 필드 초기화
      Object.keys(this.equipmentData).forEach((key) => {
        this.equipmentData[key] = '';
      });
    },
  },

  created() {
    this.getEquipList();

    // 페이지 제목 저장
    this.$store.dispatch('breadCrumb', { title: '설비 관리' });

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

    // 공통코드가 EU(설비상태)일 때
    this.getComm('EU')
      .then((result) => {
        //selectOptions에 담아 select 박스에 활용
        this.rightFields.find(
          (field) => field.value === 'is_use'
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
  },
};
</script>

<style scoped>
.fade-enter-from {
  /* opacity: 0; */
  transform: translateY(-1000px);
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter-to {
  /* opacity: 1; */
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
