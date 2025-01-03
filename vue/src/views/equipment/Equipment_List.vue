<!-- 설비 전체 조회 -->
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

        <!-- 사용유무 -->
        <div class="row mb-4 align-items-center" style="padding-left: 3rem;">
          <div class="col-lg-2 text-start fw-bolder">
            사용유무
          </div>
          <div class="col-lg-10 d-flex align-items-center">
            <div v-for="(opt, idx) in equipmentData.selectOptions.IS_USE" :key="idx" class="form-check me-4">
              <input class="form-check-input radio-inline" type="radio" v-model="equipmentData.is_use"
                :value="opt.comm_dtl_cd" :id="'is_use_' + idx" @change="searchEquipments" />
              <label class="form-check-label" :for="'is_use_' + idx">
                {{ opt.comm_dtl_nm }}
              </label>
            </div>
          </div>
        </div>

        <!-- 설비상태 -->
        <div class="row mb-2 align-items-center" style="padding-left: 3rem;">
          <div class="col-lg-2 text-start fw-bolder">
            설비상태
          </div>
          <div class="col-lg-10 d-flex align-items-center">
            <div v-for="(opt, idx) in equipmentData.selectOptions.STATUS" :key="idx" class="form-check me-4">
              <input class="form-check-input radio-inline" type="radio" v-model="equipmentData.status"
                :value="opt.comm_dtl_cd" :id="'status_' + idx" @change="searchEquipments" />
              <label class="form-check-label" :for="'status_' + idx">
                {{ opt.comm_dtl_nm }}
              </label>
            </div>
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
        /*
        rowSelection: {
          mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
        }
          */
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

        // 비동기적으로 데이터 가져오기
        const [eqpTypeResponse, isUseResponse, statusResponse] = await Promise.all([
          axios.get('/api/comm/codeList/EQ'),
          axios.get('/api/comm/codeList/EU'),
          axios.get('/api/comm/codeList/ES'),
        ]);

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

        // 기본값 설정
        this.equipmentData.eqp_type = null; // "전체"
        this.equipmentData.is_use = null;  // "전체"
        this.equipmentData.status = null;  // "전체"

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
    },
    //엑셀 함수
    excelDownload() {
      try {
        // 현재 날짜 생성
        var today = new Date();
        today = this.$comm.getMyDay(today);

        // 선택된 데이터 가져오기
        let selectedNodes = this.myApi.getSelectedNodes(); // 선택된 행 데이터 가져오기
        let selectedData;

        const formatDate = (date) => {
         return date ? this.$comm.getMyDay(new Date(date)) : '';
       };

        if (selectedNodes.length > 0) {
          // 선택된 데이터가 있을 경우
          selectedData = selectedNodes.map(item => ({
            '설비코드': item?.eqp_cd,
            '설비구분': item?.eqp_type,
            '설비명': item?.eqp_nm,
            '모델': item?.model,
            '등록일': formatDate(item?.create_dt),
            '최종점검일': formatDate(item?.last_insp_dt),
            '담당자 ID': item?.id,
            '설비상태': item?.status,
            '사용유무': item?.is_use,
          }));
        } else {
          // 선택된 데이터가 없으면 전체 데이터를 사용
          selectedData = this.rowData.map(item => ({
            '설비코드': item?.eqp_cd,
            '설비구분': item?.eqp_type,
            '설비명': item?.eqp_nm,
            '모델': item?.model,
            '등록일': formatDate(item?.create_dt),
            '최종점검일': formatDate(item?.last_insp_dt),
            '담당자 ID': item?.id,
            '설비상태': item?.status,
            '사용유무': item?.is_use,
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

        /*
       // 열 너비 자동 조정
       const colWidths = Object.keys(selectedData[0]).map(key => {
          // 최대 길이 계산 (셀의 실제 길이에 약간의 보정값 추가)
          const maxLength = Math.max(
            ...selectedData.map(row => (row[key] ? row[key].toString().length : 0)),
            key.length // 컬럼 헤더 길이 포함
          );
          return { wch: maxLength + 5 }; // 여유 공간 추가 (보정값 +5)
        });

        workSheet['!cols'] = colWidths; // 열 너비 설정
       */

        // 열 너비 자동 조정 (문자 유형에 따라 여유 공간 조정)
        const colWidths = Object.keys(selectedData[0]).map(key => {
          // 최대 길이 계산 (셀의 실제 길이에 약간의 보정값 추가)
          const maxLength = Math.max(
            ...selectedData.map(row => {
              const cellValue = row[key] ? row[key].toString() : '';
              const koreanCharCount = (cellValue.match(/[\u3131-\uD79D]/g) || []).length;
              const englishCharCount = (cellValue.match(/[a-zA-Z]/g) || []).length;
              const numberCharCount = (cellValue.match(/[0-9]/g) || []).length;
              const otherCharCount = cellValue.length - koreanCharCount - englishCharCount - numberCharCount;

              // 문자 유형별 폭 계산
              return (
                koreanCharCount * 2 + // 한글은 2배 길이
                englishCharCount * 1 + // 영문자는 1배 길이
                numberCharCount * 0.75 + // 숫자는 0.75배 길이
                otherCharCount * 1 // 기타 문자는 기본 길이
              );
            }),
            key.length // 컬럼 헤더 길이 포함
          );

          // 문자 유형별 여유 공간 추가
          const padding = maxLength > 15 ? 2 : maxLength > 10 ? 3 : 4; // 길이에 따라 동적 여유 공간
          return { wch: Math.ceil(maxLength + padding) }; // 열 너비 설정
        });

        workSheet['!cols'] = colWidths; // 계산된 열 너비 적용

        XLSX.utils.book_append_sheet(workBook, workSheet, '설비정보조회');
        XLSX.writeFile(workBook, `설비정보조회_${today}.xlsx`);
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
