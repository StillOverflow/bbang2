<!-- 설비 전체 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <!-- 검색조건 -->
      <div class="card-header bg-light ps-5 ps-md-4">

        <div class="row mb-3">

          <!-- 설비구분 -->
          <div class="center me-7">
            <p for="example-text-input" class="text-sm font-weight-bolder me-3 mt-2">설비구분</p>
            <div class="col-6 col-lg-3 mb-2">
              <select class="form-select custon-width" v-model="equipmentData.eqp_type">
                <option v-for="(opt, idx) in equipmentData.selectOptions.EQP_TYPE" :key="idx" :value="opt.comm_dtl_cd">
                  {{ opt.comm_dtl_nm }}
                </option>
              </select>
            </div>
          </div>
          <!-- 사용유무-->
          <div class="center  me-7">
            <p for="example-text-input" class="text-sm font-weight-bolder me-3 mt-2">사용유무</p>
            <div class="col-6 col-lg-3 mb-2">
              <select class="form-select custon-width" v-model="equipmentData.is_use">
                <option v-for="(opt, idx) in equipmentData.selectOptions.IS_USE" :key="idx" :value="opt.comm_dtl_cd">
                  {{ opt.comm_dtl_nm }}
                </option>
              </select>
            </div>
          </div>

          <div class="center  me-7">
            <p for="example-text-input" class="text-sm font-weight-bolder me-3 mt-2">설비상태</p>
            <div class="col-6 col-lg-3 mb-2">
              <select class="form-select custon-width" v-model="equipmentData.status">
                <option v-for="(opt, idx) in equipmentData.selectOptions.STATUS" :key="idx" :value="opt.comm_dtl_cd">
                  {{ opt.comm_dtl_nm }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="row">
          <div class="center mt-2">
            <button id="button-addon2" type="button" class="btn btn-warning me-2" @click="searchEquipments">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            <button id="button-addon2" type="button" class="btn btn-secondary" @click="resetBtn">
              <i class="fa-solid fa-rotate"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 조회 결과 -->
      <div class="card-body" style="position: relative; height: 600px">
        <ag-grid-vue style="width: 100%; height: 100%" class="ag-theme-alpine" :columnDefs="columnDefs"
          :rowData="rowData" :pagination="true"></ag-grid-vue>
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
        { field: 'last_insp_dt', headerName: '최종점검일자' },
        { field: 'id', headerName: '담당자 ID' },
      ],
    };
  },
  components: {
    AgGridVue,
  },
  created() {
    // 페이지 제목 저장
    this.$store.dispatch('breadCrumb', { title: '설비 정보 조회' });
    // 공통코드 및 초기 데이터 가져오기
    this.fetchCommonCodes();
    this.fetchFilteredEquip();
  },
  methods: {
    // 공통코드 가져오기
    async fetchCommonCodes() {
      try {

        const eqpTypeResponse = await axios.get('/api/comm/codeList/EQ');
        const isUseResponse = await axios.get('/api/comm/codeList/EU');
        const statusResponse = await axios.get('/api/comm/codeList/ES');

        this.equipmentData.selectOptions.EQP_TYPE = eqpTypeResponse.data || [];
        this.equipmentData.selectOptions.IS_USE = isUseResponse.data || [];
        this.equipmentData.selectOptions.STATUS = statusResponse.data || [];

      } catch (error) {
        console.error('공통코드 가져오기 실패:', error);
      }
    },
    // 필터링된 설비 데이터 가져오기
    async fetchFilteredEquip() {
      try {
        const obj = {
          eqp_type: this.equipmentData.eqp_type || null,
          is_use: this.equipmentData.is_use || null,
          status: this.equipmentData.status || null,
        };
        const result = await axios.get('/api/equipAllList/search', { params: obj });

        if (result.data) {
          //배열데이터 처리
          this.rowData = result.data.map((item) => ({
            ...item,
            create_dt: item.create_dt ? item.create_dt.split('T')[0] : '',
            last_insp_dt: item.last_insp_dt
              ? item.last_insp_dt.split('T')[0]
              : '',
          }));
        }
        this.rowData = result.data;
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
