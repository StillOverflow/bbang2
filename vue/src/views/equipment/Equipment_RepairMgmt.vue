<!-- 설비 수리 관리 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <!-- 헤더 -->
      <div class="card-header bg-light d-flex justify-content-center align-items-center">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <div class="input-group">
            <input id="eqp_cd" type="text" :placeholder="selectedEqp || '설비코드'" class="form-control" aria-label="설비코드"
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
          </div>

          <!-- 왼쪽 입력란 -->
          <div class="col-lg-5 col-md-5 col-sm-12">
            <div v-for="(field, index) in leftFields" :key="index" class="mb-2">
              <template v-if="field.value == 'eqp_type' || field.value == 'repair_reason'">
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
                  :min="currentDateTime ? formattedStartTime : null" @change="validateStartTime"
                  :disabled="isFieldDisabled(field.value)" />
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
              <template v-else>
                <label class="form-control-label">{{ field.label }}</label>
                <input v-model="equipmentData[field.value]" :type="field.type" class="form-control custom-width"
                  :min="equipmentData.start_time || currentDateTime" :readonly="!selectedEqp"
                  :disabled="isFieldDisabled(field.value)" @change="validateEndTime" />
              </template>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="text-center mt-3">
          <button class="btn btn-success mlp10" @click="isEditMode ? repairUpdate() : repairInsert()"
            :disabled="!selectedEqp">
            {{ isEditMode ? "UPDATE" : "SAVE" }}
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
          <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" :columnDefs="equipDefs"
            :rowData="equipData" :pagination="true" @rowClicked="modalClicked" @grid-ready="gridFit"
            overlayNoRowsTemplate="등록된 설비가 없습니다."></ag-grid-vue>
        </template>
        <template v-slot:footer>
          <button type="button" class="btn btn-secondary" @click="modalOpen">
            Cancel
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
  name: 'EquipmentRepairMgmt',
  data() {
    return {
      selectedEqp: '',
      isEditMode: false, // 등록/수정 모드 플래그 추가
      previewImage: require('@/assets/img/blank_img.png'),
      selectedFile: null,
      isModal: false,
      equipInfo: {},
      equipmentData: {
        eqp_cd: '',
        img_path: '',
        //입력 데이터 값
        start_time: '',
        eqp_type: '',
        eqp_nm: '',
        model: '',
        repair_reason: '',
        repair_act: '',
        repair_parts: '',
        end_time: '',
        note: '',
        id: '',
        repair_cd: '',
      },
      equipDefs: [
        { headerName: '설비 코드', field: 'eqp_cd', sortable: true, width: 120 },
        {
          headerName: '설비 구분', field: 'eqp_type', sortable: true, width: 130, valueFormatter: (params) => {
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
        },
        { headerName: '설비명', field: 'eqp_nm', sortable: true, width: 130 },
        { headerName: '모델명', field: 'model', sortable: true, width: 130 },
        {
          headerName: '설비상태', field: 'status', sortable: true, width: 130, valueFormatter: (params) => {
            // 상태 코드에 따른 이름 변환
            const statusMap = {
              S01: '가동',
              S02: '비가동',
            };
            return statusMap[params.value] || params.value; // 매핑된 이름 반환, 없으면 원래 값 반환
          },
        },
      ],
      equipData: [],
      leftFields: [
        { label: '수리 시작 일시', value: 'start_time', type: 'datetime-local' },
        { label: '설비 구분 *', value: 'eqp_type', type: 'text', selectOptions: [] },
        { label: '설비명 *', value: 'eqp_nm', type: 'text' },
        { label: '모델명 *', value: 'model', type: 'text' },
        { label: '수리 사유', value: 'repair_reason', type: 'text', selectOptions: [] },
        { label: '수리 업체', value: 'repair_act', type: 'text' },
      ],
      rightFields: [
        { label: '수리 종료 일시', value: 'end_time', type: 'datetime-local' },
        { label: '수리 부품', value: 'repair_parts', type: 'text' },
        { label: '비고', value: 'note', type: 'textarea' },
        { label: '등록인 ID', value: 'id', type: 'text' },
      ],
    };
  },
  computed: {
    // 현재 날짜와 시간을 반환
    // 조건부 현재 시간 반환
    currentDateTime() {
      return new Date(); // 항상 Date 객체 반환
    },
    formattedStartTime() {
      if (this.currentDateTime) {
        const now = this.currentDateTime;
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${date}T${hours}:${minutes}`;
      }
      return '';
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

    async modalClicked(params) {

      console.log('Row Data:', params.data);

      this.selectedEqp = params.data.eqp_cd;

      try {
        // 최신 비가동 데이터 가져오기
        await this.getRepairListOne(this.selectedEqp);

        // 설비 데이터 가져오기
        await this.getEquipInfo(this.selectedEqp);


        // 세션에서 비가동 등록인 ID 가져오기
        const sessionId = this.$session.get('user_id');
        console.log('모달 클릭 시 가져온 세션 ID:', sessionId);

        // 항상 세션 ID로 덮어쓰기
        this.equipmentData.id = sessionId;

        console.log('Updated equipmentData:', this.equipmentData);

        // 이미지 처리
        this.previewImage = this.equipmentData.img_path
          ? `/api/${this.equipmentData.img_path}`
          : require('@/assets/img/blank_img.png');

        this.isModal = false;

      } catch (error) {
        console.error('Error in modalClicked:', error);
      }
    },
    // 시작시간 유효성 검사
    validateStartTime() {
      if (!this.equipmentData.start_time) return; // 시작 시간이 비어있으면 검사 건너뜀
      const startTime = new Date(this.equipmentData.start_time);
      const minStartTime = new Date(this.currentDateTime.getTime()); // 현재 시간
      if (startTime < minStartTime) {
        Swal.fire({
          icon: 'error',
          title: '유효성 검사 실패',
          text: '시작시간은 현재시간 이후로 설정해야 합니다.',
        });
        this.equipmentData.start_time = ''; // input 필드 초기화
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

    // 공통코드 가져오기
    async getComm(cd) {
      const result = await axios.get(`/api/comm/codeList/${cd}`).catch((err) => console.log(err));
      return result.data;
    },



    // 설비 단건 조회
    async getEquipInfo(eqp_cd) {
      const result = await axios.get(`/api/equip/${eqp_cd}`).catch((err) => console.log(err));

      if (result.data) {
        this.equipmentData = {
          ...this.equipmentData,
          ...result.data,
        };


        // 이미지 경로 처리
        this.previewImage = result.data.img_path
          ? `/api/${result.data.img_path}`
          : require('@/assets/img/blank_img.png');
      }
    },



    // 설비 전체 조회
    async getEquipList() {
      const result = await axios.get(`/api/equip`).catch((err) => console.log(err));
      this.equipData = result.data; // 서버가 실제로 보낸 데이터
    },

    //수리 조회(최신1건)
    // 설비 단건 조회
    async getRepairListOne(eqp_cd) {

      try {
        const result = await axios.get(`/api/equip/repair/${eqp_cd}`);
        console.log('Result data:', result.data);
        if (result.data) {
          this.equipmentData = {
            ...this.equipmentData,
            ...result.data,
            repair_cd: result.data.repair_cd || this.equipmentData.repair_cd, // repair_cd 업데이트
            start_time: result.data.start_time ? this.formatDate(result.data.start_time) : this.equipmentData.start_time,
            end_time: result.data.end_time ? this.formatDate(result.data.end_time) : this.equipmentData.end_time,
          };


          // 등록 모드 조건: repair_cd 없거나 end_time이 존재하는 경우
          if (!result.data.repair_cd || result.data.end_time) {
            this.isEditMode = false;
            this.resetForm(); // 등록 모드로 초기화
            this.equipmentData.eqp_cd = eqp_cd; // 설비 코드 유지
          } else {
            // 수정 모드 조건: repair_cd가 있고 end_time이 비어 있는 경우
            this.isEditMode = true;
          }

        }
      } catch (err) {
        console.error('Error fetching repair data:', err);
      }
    },

    //등록
    async repairInsert() {

      try {

        // 세션에서 비가동 등록인 ID 가져오기
        const sessionId = this.$session.get('user_id');
        console.log('등록 시 가져온 세션 ID:', sessionId);

        this.equipmentData.id = sessionId; // 기존 값을 무시하고 세션 ID로 덮어쓰기

        const obj = {
          eqp_cd: this.equipmentData.eqp_cd,
          start_time: this.equipmentData.start_time ? this.formatDate(this.equipmentData.start_time) : null,
          end_time: this.equipmentData.end_time ? this.formatDate(this.equipmentData.end_time) : null,
          repair_reason: this.equipmentData.repair_reason || '',
          repair_parts: this.equipmentData.repair_parts || '',
          repair_act: this.equipmentData.repair_act || '',
          note: this.equipmentData.note || '',
          id: this.equipmentData.id,
        };

        //서버로 데이터 전송
        const result = await axios.post('/api/equip/repair', obj);

        //서버 응답처리
        let addRes = result.data; // 서버에서 반환된 응답 처리
        if (addRes.success) {
          this.equipmentData.repair_cd = result.data.repair_cd; // 새로 생성된 repair_cd 설정
          this.isEditMode = true; // 등록 후 수정 모드로 전환

          Swal.fire({
            icon: 'success',
            title: '등록 완료',
            text: '수리 데이터가 등록되었습니다.',
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: '등록 실패',
          text: '수리 데이터 등록 중 오류가 발생했습니다.',
        });
      }
    },
    async repairUpdate() {

      console.log('Updating data:', this.equipmentData); // 데이터 출력

      try {

        // 세션에서 비가동 등록인 ID 가져오기
        const sessionId = this.$session.get('user_id');
        console.log('수정 시 가져온 세션 ID:', sessionId);

        // 기존 ID가 없을 경우에만 세션 ID를 설정
        if (!this.equipmentData.id && sessionId) {
          this.equipmentData.id = sessionId; // 점비가동 등록인 ID에 세션 ID 설정
        }

        const obj = {
          eqp_cd: this.equipmentData.eqp_cd,
          start_time: this.equipmentData.start_time ? this.formatDate(this.equipmentData.start_time) : null,
          end_time: this.equipmentData.end_time ? this.formatDate(this.equipmentData.end_time) : null,
          repair_cd: this.equipmentData.repair_cd, // 수정 요청에 필요한 repair_cd 추가
          repair_reason: this.equipmentData.repair_reason || '',
          note: this.equipmentData.note || '',
          repair_parts: this.equipmentData.repair_parts || '',
          repair_act: this.equipmentData.repair_act || '',
          id: this.equipmentData.id,
        };

        console.log('보낼 데이터:', obj);

        const result = await axios.put(`/api/equip/repair/${this.equipmentData.repair_cd}`, obj);

        if (result.data.success) {
          Swal.fire({
            icon: 'success',
            title: '수정 완료',
            text: '수리 데이터가 수정되었습니다.',
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: '수정 실패',
          text: '수리 데이터 수정 중 오류가 발생했습니다.',
        });
      }
    },

    resetForm() {
      const resetFields = {
        start_time: '',
        end_time: '',
        repair_reason: '',
        repair_parts: '',
        repair_act: '',
        note: '',
      };

      this.equipmentData = {
        ...this.equipmentData,
        ...resetFields, // 초기화된 데이터 병합
      };

      // 선택된 설비 코드 초기화
      this.selectedEqp = this.equipmentData.eqp_cd;
      this.isEditMode = false; // 초기화 시 수정 모드도 해제
      this.previewImage = require('@/assets/img/blank_img.png'); // 이미지 초기화
    },

    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`; // datetime-local 형식
    },
    isFieldDisabled(fieldName) {
      // 설비 코드가 선택되지 않았을 경우 모든 항목 비활성화
      if (!this.selectedEqp) return true;

      const alwaysDisabled = ['eqp_type', 'eqp_nm', 'model', 'id'];

      // 수정 모드일 때 시작시간 비활성화
      if (this.isEditMode && fieldName === 'start_time') {
        return true;
      }

      // 등록 모드와 수정 모드에 따른 비활성화 처리
      if (!this.isEditMode) {
        return alwaysDisabled.includes(fieldName); // 등록 모드에서 특정 필드 비활성화
      }

      // 기본 비활성화 조건
      return alwaysDisabled.includes(fieldName);
    },
  },
  created() {
    this.resetForm(); // 초기화 호출
    this.getEquipList();
    this.$store.dispatch('breadCrumb', { title: '설비 수리 관리' });

    // this.equipmentData.start_time = this.currentDateTime;


    // 세션에서 수리 등록인 ID 가져오기
    const sessionId = this.$session.get('user_id');
    console.log('Created에서 가져온 세션 ID:', sessionId);


    //설비구분
    this.getComm('EQ').then((result) => {
      this.leftFields.find((field) => field.value === 'eqp_type').selectOptions = result.map((item) => ({
        item: item.comm_dtl_cd,
        name: item.comm_dtl_nm,
      }));

    });

    /*
    //설비상태구분
    this.getComm('ES').then((result) => {
      this.leftFields.find((field) => field.value === 'status').selectOptions = result
        .sort((a) => a.comm_dtl_nm === '비가동' ? -1 : 1) // "비가동"을 첫 번째로 설정
        .map((item) => ({
          item: item.comm_dtl_cd,
          name: item.comm_dtl_nm,
        }));
    });
    */

    //수리사유구분
    this.getComm('ER').then((result) => {
      this.leftFields.find((field) => field.value === 'repair_reason').selectOptions = result.map((item) => ({
        item: item.comm_dtl_cd,
        name: item.comm_dtl_nm,
      }));
    });
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
