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
          <div class="col-lg-2 col-md-3 col-sm-12 text-center">
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

              <template v-else-if="field.value == 'pur_act' || field.value == 'mfg_act'">
                <label class="form-control-label">{{ field.label }}</label>
                <div class="input-group custom-width">
                  <input v-model="equipmentData[field.value]" :type="field.type" class="form-control " readonly />
                  <button class="btn btn-warning" id="button-addon2" type="button" @click="modalOpen3(field.value)">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </template>

              <template v-else-if="field.value == 'repl_cycle' || field.value == 'insp_cycle'">
                <label class="form-control-label">{{ field.label }}</label>
                <input v-model="equipmentData[field.value]" :type="field.type" class="form-control custom-width"
                  @change="checkNumberAlert(field)" :disabled="isFieldDisabled(field.value)" />
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
                  :disabled="isFieldDisabled(field.value)" @change="statusChange">
                  <option v-for="(opt, idx) in field.selectOptions" :key="idx" :value="opt.item">
                    {{ opt.name }}
                  </option>
                </select>
              </template>

              <template v-else-if="field.value == 'id'">
                <label class="form-control-label">{{ field.label }}</label>
                <div class="input-group custom-width">
                  <input v-model="equipmentData[field.value]" :type="field.type" class="form-control " readonly />
                  <button class="btn btn-warning" id="button-addon2" type="button" @click="modalOpen2">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </template>


              <template v-else>
                <label class="form-control-label">{{ field.label }}</label>
                <input v-model="equipmentData[field.value]" :type="field.type" class="form-control custom-width"
                  @change="checkNumberAlert(field)" :disabled="isFieldDisabled(field.value)" />
              </template>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="text-center mt-3">
          <button v-if="isEditMode" class="btn btn-success mlp10" @click="equipUpdate">
            수정
          </button>
          <button v-if="!isEditMode" class="btn btn-primary mlp10" @click="equipInsert">
            등록
          </button>
          <button class="btn btn-secondary mlp10" @click="resetForm">
            초기화
          </button>
        </div>
      </div>
    </div>
  </div>

  <!--모달-->
  <!-- 설비 코드 모달 -->
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
        <button type="button" class="btn btn-secondary mx-auto" @click="modalOpen">
          닫기
        </button>
      </template>
    </Layout>
  </Transition>

  <!-- 담당자 선택 모달 -->
  <Transition name="fade">
    <Layout :modalCheck="isModal2">
      <template v-slot:header>
        <h5 class="modal-title">담당자 선택</h5>
        <button type="button" aria-label="Close" class="close" @click="modalOpen2">×</button>
      </template>
      <template v-slot:default>
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px" :columnDefs="memDefs" :rowData="memData"
          :pagination="true" @rowClicked="modalClicked2" @grid-ready="gridFit" overlayNoRowsTemplate="등록된 담당자가 없습니다.">
        </ag-grid-vue>
      </template>
      <template v-slot:footer>
        <button type="button" class="btn btn-secondary mx-auto" @click="modalOpen2">닫기</button>
      </template>
    </Layout>
  </Transition>

  <!-- 거래처 선택 모달 -->
  <Transition name="fade">
    <Layout :modalCheck="isModal3">
      <template v-slot:header>
        <h5 class="modal-title">거래처 선택</h5>
        <button type="button" aria-label="Close" class="close" @click="modalOpen3">×</button>
      </template>
      <template v-slot:default>
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px" :columnDefs="accDefs" :rowData="accData"
          :pagination="true" @rowClicked="modalClicked3" @grid-ready="gridFit" overlayNoRowsTemplate="등록된 거래처가 없습니다.">
        </ag-grid-vue>
      </template>
      <template v-slot:footer>
        <button type="button" class="btn btn-secondary mx-auto" @click="modalOpen3">닫기</button>
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
      targetField: '', // Modal3 거래처 어떤 필드를 채울지 구분
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
        { headerName: '설비 코드', field: 'eqp_cd', filter: 'agTextColumnFilter', sortable: true, width: 160, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        {
          headerName: '설비 구분',
          field: 'eqp_type',
          filter: 'agTextColumnFilter',
          sortable: true, width: 160, valueFormatter: (params) => {
            const eqpTypeMap = {
              R01: '배합기',
              R02: '분할기',
              R03: '발효기',
              R04: '성형기',
              R05: '오븐',
              R06: '냉각기',
              R07: '도포기',
              R08: '커팅기',
              R09: '포장기',
              R10: '세척기',
            }; // 코드와 이름 매핑
            return eqpTypeMap[params.value] || params.value; // 매핑된 이름 반환, 없으면 원래 값
          },
          cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center',
        },
        {
          headerName: '설비명',
          field: 'eqp_nm',
          sortable: true, width: 160,
          filter: 'agTextColumnFilter',
          cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center',
        },
        {
          headerName: '모델명', field: 'model', filter: 'agTextColumnFilter', sortable: true, width: 161,
          cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center',
        },
      ],

      memDefs: [
        { headerName: '담당자 ID', field: 'ID', width: 200, filter: 'agTextColumnFilter', cellStyle: { textAlign: 'center' } },
        { headerName: '담당자 명', field: 'name', width: 235, filter: 'agTextColumnFilter', cellStyle: { textAlign: 'center' } },
        { headerName: '부서', field: 'dpt_nm', width: 210, filter: 'agTextColumnFilter', cellStyle: { textAlign: 'center' } },
      ],

      accDefs: [
        { headerName: '거래처 코드', field: 'act_cd', width: 200, filter: 'agTextColumnFilter', cellStyle: { textAlign: 'center' } },
        { headerName: '거래처 명', field: 'act_nm', width: 235, filter: 'agTextColumnFilter', cellStyle: { textAlign: 'center' } },
        { headerName: '구분', field: 'act_type', width: 210, filter: 'agTextColumnFilter', cellStyle: { textAlign: 'center' } },
      ],

      equipData: [],
      memData: [],
      accData: [],

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
        { label: '점검주기 (일)', value: 'insp_cycle', type: 'text' },
        { label: '교체주기 (년)', value: 'repl_cycle', type: 'text' },
      ],
      rightFields: [
        { label: '적정 온도 (°C)', value: 'opt_temp', type: 'text' },
        { label: '적정 습도 (%)', value: 'opt_humid', type: 'text' },
        { label: '적정 RPM (분당 회전수)', value: 'opt_rpm', type: 'text' },
        { label: '적정 속도 (m/s)', value: 'opt_speed', type: 'text' },
        { label: '적정 전력량 (kW)', value: 'opt_power', type: 'text' },
        { label: 'UPH (Unit Per Hour)', value: 'uph', type: 'text' },
        { label: '사용유무', value: 'is_use', type: 'text', selectOptions: [] },
        { label: '설비담당자', value: 'id', type: 'text' },
      ],

      isModal: false,
      isModal2: false,
      isModal3: false,
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
    modalOpen2() {
      this.isModal2 = !this.isModal2;
    },
    modalOpen3(field) {
      this.targetField = field;  // 어떤 필드를 설정할지 지정
      this.isModal3 = !this.isModal3;
    },
    modalClicked(params) {
      this.getEquipInfo(params.data.eqp_cd);
      this.selectedEqp = params.data.eqp_cd;
      this.isModal = !this.isModal;
    },
    modalClicked2(params) {
      this.equipmentData.id = params.data.ID;
      this.isModal2 = false;
    },
    modalClicked3(params) {
      if (this.targetField === 'pur_act') {
        this.equipmentData.pur_act = params.data.act_cd; // 구매업체
      } else if (this.targetField === 'mfg_act') {
        this.equipmentData.mfg_act = params.data.act_cd; // 제조업체
      }
      this.isModal3 = false;
    },


    // is_use 바뀔 때마다 설비상태도 자동 전환 함수
    statusChange() {
      let isUse = this.equipmentData.is_use;
      let status = isUse == 'T01' ? 'S01' : 'S02';
      this.equipmentData.status = status;
    },

    // input text에서 숫자 유효성 확인용
    checkNumberAlert(field) {
      let val = this.equipmentData[field.value];

      if (field.type == 'text') {
        val = !val ? 0 : val; // 입력값 null이면 0으로 취급

        if (isNaN(val)) { // 숫자가 아닌 경우
          this.$swal(
            '입력 오류',
            `숫자를 정확히 입력해주세요.`,
            'warning'
          );
          val = 0; // 숫자 아니면 0으로 돌려줌.
        } else if (val < 0) {
          val = val * -1; // 입력값이 음수면 양수로 변환
        }
      }

      this.equipmentData[field.value] = val;
    },

    // LAST_INSP_DT 값 변환 함수
    formatDate(date) {
      const jsDate = new Date(date);
      const year = jsDate.getFullYear();
      const month = String(jsDate.getMonth() + 1).padStart(2, '0');
      const day = String(jsDate.getDate()).padStart(2, '0');
      const hours = String(jsDate.getHours()).padStart(2, '0');
      const minutes = String(jsDate.getMinutes()).padStart(2, '0');
      const seconds = String(jsDate.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
        // 생산중인 설비는 수정할 수 없어야 하므로 함수로 컬럼 만들어 판단
        if (result.data.is_prod == 1) {
          this.selectedEqp = null;
          this.$swal({
            icon: 'error',
            title: '수정 불가',
            text: '해당 설비는 현재 생산중인 설비입니다.',
          });
          return;
        };

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

    //멤버조회
    async getMemList() {
      let result = await axios.get('/api/momem')
        .catch(err => console.log(err));
      this.memData = result.data;
    },

    //거래처조회
    async getAccList() {
      try {
        let result = await axios.get('/api/moacc')
          .catch(err => console.log(err));
        this.accData = result.data;
      } catch (error) {
        console.error('Error fetching account data:', error);

      }
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

      // 날짜 필드 변환
      if (formData.has('last_insp_dt')) {
        const lastInspDt = formData.get('last_insp_dt');
        if (lastInspDt) {
          formData.set('last_insp_dt', this.formatDate(lastInspDt)); // 수정된 값 덮어쓰기
        }
      }

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
          this.selectedEqp = '';
          this.equipmentData = {};
          this.selectedFile = null;
          this.previewImage = require('@/assets/img/blank_img.png');
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
      if (!this.isEditMode) {
        this.selectedEqp = ''; // 설비 코드 입력란 초기화
      }
      this.selectedFile = null; // 선택된 파일 초기화
      this.previewImage = require('@/assets/img/blank_img.png'); // 기본 이미지로 초기화

      this.isEditMode = false; // 수정 모드 종료
      // 입력 필드 초기화
      Object.keys(this.equipmentData).forEach((key) => {
        this.equipmentData[key] = '';
      });

    },
  },

  created() {
    this.getEquipList();
    this.getMemList();
    this.getAccList();

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
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.7s;
}

.fade-enter-to {
  opacity: 1;
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
