<!-- 설비 전체 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <!-- 검색조건 -->
      <div class="card-header bg-light ps-5 ps-md-4">

        <div class="row mb-3">

          <!-- 설비구분 -->
          <div class=" me-7">
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
          <div class="  me-7">
            <p for="example-text-input" class="text-sm font-weight-bolder me-3 mt-2">사용유무</p>
            <div class="col-6 col-lg-3 mb-2">
              <select class="form-select custon-width" v-model="equipmentData.is_use">
                <option v-for="(opt, idx) in equipmentData.selectOptions.IS_USE" :key="idx" :value="opt.comm_dtl_cd">
                  {{ opt.comm_dtl_nm }}
                </option>
              </select>
            </div>
          </div>

          <div class="  me-7">
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
        <ag-grid-vue style="width: 100%; height: 100%" class="ag-theme-alpine" :gridOptions="gridOptions"
          @grid-ready="myGrid" :columnDefs="columnDefs" :rowData="rowData" :pagination="true"></ag-grid-vue>
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
        { field: 'eqp_cd', headerName: '설비코드', sortable: true },
        { field: 'eqp_type', headerName: '설비구분', sortable: true },
        { field: 'eqp_nm', headerName: '설비명', sortable: true },
        { field: 'model', headerName: '모델', sortable: true },
        { field: 'create_dt', headerName: '등록일', sortable: true, valueFormatter: this.$comm.dateFormatter },
        { field: 'last_insp_dt', headerName: '최종점검일', sortable: true, valueFormatter: this.$comm.dateFormatter },
        { field: 'id', headerName: '담당자 ID', sortable: true },
        { field: 'status', headerName: '설비상태', sortable: true },
        { field: 'is_use', headerName: '사용유무', sortable: true },

      ],

      gridOptions: {
        pagination: true,
        paginationAutoPageSize: true, // 표시할 수 있는 행을 자동으로 조절함.

        suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        rowSelection: {
          mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
        }
      }

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

    myGrid(params) { // 매개변수 속성으로 자동 접근
      params.api.sizeColumnsToFit(); // 가로스크롤 삭제
      this.myApi = params.api;
      this.myColApi = params.columnApi; // api, columnApi 둘 다 꼭 있어야 함
    },

    // 공통코드 가져오기
    async fetchCommonCodes() {
      try {

        const eqpTypeResponse = await axios.get('/api/comm/codeList/EQ');
        const isUseResponse = await axios.get('/api/comm/codeList/EU');
        const statusResponse = await axios.get('/api/comm/codeList/ES');

        this.equipmentData.selectOptions.EQP_TYPE = [
          { comm_dtl_cd: null, comm_dtl_nm: '전체' }, // "전체" 추가
          ...(eqpTypeResponse.data || []),
        ];
        this.equipmentData.selectOptions.IS_USE = [
          { comm_dtl_cd: null, comm_dtl_nm: '전체' }, // "전체" 추가
          ...(isUseResponse.data || []),
        ];
        this.equipmentData.selectOptions.STATUS = [
          { comm_dtl_cd: null, comm_dtl_nm: '전체' }, // "전체" 추가
          ...(statusResponse.data || []),
        ];

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
        const result = await axios.get('/api/equipList/search', { params: obj });

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

    resetBtn() {
      this.equipmentData.eqp_type = null; // "전체" 선택
      this.equipmentData.is_use = null;  // "전체" 선택
      this.equipmentData.status = null;  // "전체" 선택
      this.fetchFilteredEquip();         // 초기화 후 데이터 조회
    }
  },
};
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트
@import '../../../node_modules/ag-grid-community/styles/ag-grid.css';
@import '../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css';
</style>
