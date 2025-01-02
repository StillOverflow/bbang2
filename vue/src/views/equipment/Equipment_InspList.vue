<!-- 설비 점검 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <!-- 검색조건 -->
      <div class="card-header bg-light ps-5 ps-md-4">

        <!--설비구분-->
        <div class="row mb-4 align-items-center" style="padding-left: 3rem;">
          <div class="col-lg-2 text-start fw-bolder">
            설비구분
          </div>
          <div class="col-lg-4">
            <select class="form-select" v-model="equipmentData.eqp_type" @change="searchEquipments">
              <option v-for="(opt, idx) in equipmentData.selectOptions.EQP_TYPE" :key="idx" :value="opt.comm_dtl_cd">
                {{ opt.comm_dtl_nm }}
              </option>
            </select>
          </div>
        </div>

        <!-- 점검사유 -->
        <div class="row mb-4 align-items-center" style="padding-left: 3rem;">
          <div class="col-lg-2 text-start fw-bolder">
            점검사유
          </div>
          <div class="col-lg-4">
            <select class="form-select" v-model="equipmentData.insp_reason" @change="searchEquipments">
              <option v-for="(opt, idx) in equipmentData.selectOptions.INSP_REASON" :key="idx" :value="opt.comm_dtl_cd">
                {{ opt.comm_dtl_nm }}
              </option>
            </select>
          </div>
        </div>


        <!-- 버튼 -->

        <div class="row">
          <div class="d-flex justify-content-center align-items-center mt-2">
            <!-- <button id="button-addon2" type="button" class="btn btn-warning me-2" @click="searchEquipments">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button> -->
            <!-- 초기화 버튼 -->
            <button id="button-addon2" type="button" class="btn btn-secondary me-3" @click="resetBtn">
              <i class="fa-solid fa-rotate"></i>
            </button>

            <!-- 엑셀 버튼 -->
            <button class="btn btn-outline-success" @click="excelDownload()">
              <i class="fa-regular fa-file-excel"></i> EXCEL
            </button>
          </div>
        </div>
      </div>

      <!-- 조회 결과 -->
      <div class="card-body" style="position: relative; height: 600px">
        <ag-grid-vue style="width: 100%; height: 100%" class="ag-theme-alpine" :gridOptions="gridOptions"
          @grid-ready="myGrid" :columnDefs="columnDefs" :rowData="rowData" :pagination="true"
          overlayNoRowsTemplate="해당하는 설비가 없습니다."></ag-grid-vue>
      </div>


    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
  name: 'EquipmentInspList',
  data() {
    return {
      equipmentData: {
        eqp_type: '', // 설비구분
        insp_reason: '', // 점검사유
        selectOptions: {
          EQP_TYPE: [], // 설비구분 공통코드
          INSP_REASON: [], // 점검사유 공통코드
        },
      },
      rowData: [], // ag-grid의 데이터
      columnDefs: [
        { field: 'eqp_cd', headerName: '설비코드', sortable: true },
        { field: 'eqp_type', headerName: '설비구분', sortable: true },
        { field: 'eqp_nm', headerName: '설비명', sortable: true },
        { field: 'insp_cycle', headerName: '점검주기(일)', sortable: true },
        { field: 'last_insp_dt', headerName: '최종점검일', sortable: true, valueFormatter: this.$comm.dateFormatter },
        { field: 'insp_reason', headerName: '점검사유', sortable: true },
        { field: 'insp_result', headerName: '점검판정', sortable: true },
        { field: 'insp_action', headerName: '조치사항', sortable: true },
        { field: 'id', headerName: '점검담당자 ID', sortable: true },
        {
          field: 'start_time',
          headerName: '점검시작일시',
          sortable: true,
          valueFormatter: (params) => this.formatDateTime(params.value), width: 250
        },
        {
          field: 'end_time',
          headerName: '점검종료일시',
          sortable: true,
          valueFormatter: (params) => this.formatDateTime(params.value), width: 250
        },

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
    this.$store.dispatch('breadCrumb', { title: '설비 점검 조회' });
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

    //날짜포맷
    formatDateTime(value) {
      if (!value) return ''; // 값이 없으면 빈 문자열 반환
      const date = new Date(value);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ` +
        `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },


    // 공통코드 가져오기
    async fetchCommonCodes() {
      try {

        const eqpTypeResponse = await axios.get('/api/comm/codeList/EQ');
        const inspReasonResponse = await axios.get('/api/comm/codeList/EX');

        this.equipmentData.selectOptions.EQP_TYPE = [
          { comm_dtl_cd: null, comm_dtl_nm: '전체' }, // "전체" 추가
          ...(eqpTypeResponse.data || []),
        ];
        this.equipmentData.selectOptions.INSP_REASON = [
          { comm_dtl_cd: null, comm_dtl_nm: '전체' }, // "전체" 추가
          ...(inspReasonResponse.data || []),
        ];


        // 기본값 설정
        this.equipmentData.eqp_type = null; // "전체"
        this.equipmentData.insp_reason = null;  // "전체"

      } catch (error) {
        console.error('공통코드 가져오기 실패:', error);
      }
    },
    // 필터링된 설비 데이터 가져오기
    async fetchFilteredEquip() {
      try {
        const obj = {
          eqp_type: this.equipmentData.eqp_type || null,
          insp_reason: this.equipmentData.insp_reason || null,
        };
        const result = await axios.get('/api/equipList/insp', { params: obj });

        console.log('API 요청 파라미터:', obj);

        if (result.data) {
          //배열데이터 처리
          this.rowData = result.data.map((item) => ({
            ...item,
            last_insp_dt: item.last_insp_dt
              ? item.last_insp_dt.split('T')[0]
              : '',
            start_time: item.start_time
              ? item.start_time.split('T')[0]
              : '',
            end_time: item.end_time
              ? item.end_time.split('T')[0]
              : '',
          }));
        }
        this.rowData = result.data;
      } catch (error) {
        console.error('설비 점검 데이터 조회 실패:', error);
      }
    },
    // 조회 버튼 클릭 시 실행
    searchEquipments() {
      this.fetchFilteredEquip();
    },

    resetBtn() {
      this.equipmentData.eqp_type = null; // "전체" 선택
      this.equipmentData.insp_reason = null;  // "전체" 선택
      this.fetchFilteredEquip();         // 초기화 후 데이터 조회
    },
    //엑셀 함수
    excelDownload() {
      try {
        // 현재 날짜 생성
        var today = new Date();
        today = this.$comm.dateFormatter(today);

        // 선택된 데이터 가져오기
        let selectedNodes = this.myApi.getSelectedNodes(); // 선택된 행 데이터 가져오기
        let selectedData;

        if (selectedNodes.length > 0) {
          // 선택된 데이터가 있을 경우
          selectedData = selectedNodes.map(item => ({
            '설비코드': item?.eqp_cd,
            '설비구분': item?.eqp_type,
            '설비명': item?.eqp_nm,
            '점검주기(일)': item?.insp_cycle,
            '최종점검일': item?.last_insp_dt,
            '점검사유': item?.insp_reason,
            '점검판정': item?.insp_result,
            '조치사항': item?.insp_action,
            '점검담당자ID': item?.id,
            '점검시작일시': item?.start_time,
            '점검종료일시': item?.end_time,
          }));
        } else {
          // 선택된 데이터가 없으면 전체 데이터를 사용
          selectedData = this.rowData.map(item => ({
            '설비코드': item?.eqp_cd,
            '설비구분': item?.eqp_type,
            '설비명': item?.eqp_nm,
            '점검주기(일)': item?.insp_cycle,
            '최종점검일': item?.last_insp_dt,
            '점검사유': item?.insp_reason,
            '점검판정': item?.insp_result,
            '조치사항': item?.insp_action,
            '점검담당자ID': item?.id,
            '점검시작일시': item?.start_time,
            '점검종료일시': item?.end_time,
          }));
        }

        if (selectedData.length === 0) {
          this.$swal({
            icon: 'warning',
            title: '데이터 없음',
            text: '엑셀로 내보낼 데이터가 없습니다.',
          });
          return;
        }

        // 엑셀 파일 생성 및 다운로드
        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(selectedData);
        XLSX.utils.book_append_sheet(workBook, workSheet, '설비점검조회');
        XLSX.writeFile(workBook, `설비점검조회_${today}.xlsx`);
      } catch (error) {
        console.error('엑셀 다운로드 실패:', error);
        this.$swal({
          icon: 'error',
          title: '엑셀 다운로드 실패',
          text: '엑셀 파일 생성 중 오류가 발생했습니다.',
        });
      }
    },

  },
};
</script>

<style scoped lang="scss">
/* 라디오 버튼과 라벨 수직 정렬 */
.form-check-input {
  vertical-align: middle;
  /* 라벨 텍스트와 버튼을 동일 높이에 배치 */
  margin-top: 0;
  /* 버튼의 수직 위치 조정 */
  margin-right: 0.5rem;
  /* 라디오 버튼과 라벨 사이 간격 */
}

/* 라벨 텍스트 높이 맞추기 */
.form-check-label {
  line-height: 1;
  /* 라벨 텍스트의 높이를 라디오 버튼과 맞춤 */
  margin-bottom: 0;
  /* 불필요한 아래 여백 제거 */
  display: flex;
  align-items: center;
  /* 라디오 버튼과 동일 높이에 위치 */
}

/* 라디오 버튼 그룹의 전체 정렬 */
.form-check {
  display: flex;
  /* 플렉스 박스 사용 */
  align-items: center;
  /* 라디오 버튼과 라벨 수직 정렬 */
}

//그리드 사용시 아래 스타일 임포트
@import '../../../node_modules/ag-grid-community/styles/ag-grid.css';
@import '../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css';
</style>
