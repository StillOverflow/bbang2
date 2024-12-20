<!-- 설비 전체 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <!-- 검색조건 -->
      <div class="card-header bg-light ps-5 ps-md-4">
        <div class="row">
          <div class="col-6 col-lg-2"></div>
          <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder">
            설비 구분
          </div>

          <div class="col-6 col-lg-3 mb-2">
            <select
              class="form-select custon-width"
              v-model="equipmentData.eqp_type"
            >
              <option
                v-for="(opt, idx) in equipmentData.selectOptions.EQP_TYPE"
                :key="idx"
                :value="opt.comm_dtl_cd"
              >
                {{ opt.comm_dtl_nm }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-6 col-lg-2"></div>
          <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder">
            사용 유무
          </div>
          <div class="col-6 col-lg-3 mb-2">
            <select
              class="form-select custon-width"
              v-model="equipmentData.is_use"
            >
              <option
                v-for="(opt, idx) in equipmentData.selectOptions.IS_USE"
                :key="idx"
                :value="opt.comm_dtl_cd"
              >
                {{ opt.comm_dtl_nm }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-6 col-lg-2"></div>
          <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder">
            설비 상태
          </div>
          <div class="col-6 col-lg-3 mb-2">
            <select
              class="form-select custon-width"
              v-model="equipmentData.status"
            >
              <option
                v-for="(opt, idx) in equipmentData.selectOptions.STATUS"
                :key="idx"
                :value="opt.comm_dtl_cd"
              >
                {{ opt.comm_dtl_nm }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-6 col-lg-4 mb-2"></div>
          <div class="col-6 col-lg-1 mb-2">
            <button
              type="button"
              class="btn mb-0 btn-warning btn-xsm null null ms-auto"
              @click="searchEquipments"
            >
              검색
            </button>
          </div>
        </div>
      </div>
      <!-- 조회 결과 -->
      <div class="card-body" style="position: relative; height: 600px">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :pagination="true"
        ></ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  name: 'EquipmentAllList',
  data() {
    return {
      equipmentData: {
        eqp_type: '', // 설비구분
        is_use: '', // 사용유무
        status: '', // 설비상태
        selectOptions: {
          EQP_TYPE: [], // 설비구분 공통코드
          IS_USE: [], // 사용유무 공통코드
          STATUS: [], // 설비상태 공통코드
        },
      },
      rowData: [], // ag-grid의 데이터
      columnDefs: [
        { field: 'eqp_type', headerName: '설비구분' },
        { field: 'eqp_cd', headerName: '설비코드' },
        { field: 'eqp_nm', headerName: '설비명' },
        { field: 'model', headerName: '모델' },
        { field: 'status', headerName: '설비상태' },
        { field: 'create_dt', headerName: '등록일자' },
        { field: 'end_dt', headerName: '최종점검일자' },
        { field: 'id', headerName: '담당자' },
      ],
    };
  },
  components: {
    AgGridVue,
  },
  created() {
    // 공통코드 및 초기 데이터 가져오기
    this.fetchCommonCodes();
    this.fetchFilteredEquip();
  },
  methods: {
    // 공통코드 가져오기
    async fetchCommonCodes() {
      try {
        const eqpTypeResponse = await axios.get('/api/commList/EQ');
        const isUseResponse = await axios.get('/api/commList/T');
        const statusResponse = await axios.get('/api/commList/S');

        this.equipmentData.selectOptions.EQP_TYPE = eqpTypeResponse.data;
        this.equipmentData.selectOptions.IS_USE = isUseResponse.data;
        this.equipmentData.selectOptions.STATUS = statusResponse.data;
      } catch (error) {
        console.error('공통코드 가져오기 실패:', error);
      }
    },
    // 필터링된 설비 데이터 가져오기
    async fetchFilteredEquip() {
      try {
        const params = {
          eqp_type: this.equipmentData.eqp_type,
          is_use: this.equipmentData.is_use,
          status: this.equipmentData.status,
        };
        const response = await axios.get('/api/equip', { params });
        this.rowData = response.data;
      } catch (error) {
        console.error('설비 데이터 조회 실패:', error);
      }
    },
    // 조회 버튼 클릭 시 실행
    searchEquipments() {
      this.fetchFilteredEquip();
    },
  },
};
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트
@import '../../../node_modules/ag-grid-community/styles/ag-grid.css';
@import '../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css';
</style>
