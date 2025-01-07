<!-- 설비 수리 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <!-- 검색조건 -->
      <div class="card-header bg-light ps-5 ps-md-4">

        <!-- 일자별 검색 -->
        <div class="row mt-2 mb-4" style="padding-left: 3rem;">
          <div class="col col-lg-2 text-start fw-bolder w-10">
            수리 기간
          </div>
          <div class="col col-lg-2">
            <input class="form-control" type="date" v-model="start_datetime" :max="this.end_datetime"
              @change="searchEquipments">
          </div>
          <div class="col col-sm-1 text-center mt-2 fw-bolder" :style="t_overflow">~</div>
          <div class="col col-lg-2">
            <input class="form-control" type="date" v-model="end_datetime" :min="this.start_datetime"
              @change="searchEquipments">
          </div>
        </div>

        <!-- 설비코드 검색-->
        <div class="row mb-4" style="padding-left: 3rem;">
          <div class="col col-lg-2 text-start fw-bolder w-10">
            설비코드
          </div>
          <div class="col col-lg-3">
            <div class="input-group">
              <input type="text" class="form-control" v-model="selectedEqp" placeholder="설비코드" aria-label="설비코드"
                aria-describedby="button-addon2" @input="searchEquipments" @click="modalOpen" />
              <button class="btn btn-warning" id="button-addon2" type="button" @click="modalOpen">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>


          <!-- 설비명 검색 -->
          <div class="col col-lg-2 text-start fw-bolder w-10">
            설비명
          </div>
          <div class="col col-lg-3">
            <input type="text" class="form-control" v-model="equipmentData.eqp_nm" placeholder="설비명을 입력하세요"
              @input="searchEquipments" />
          </div>
        </div>

        <!--설비구분-->
        <div class=" row mb-4" style="padding-left: 3rem;">
          <div class="col col-lg-2 text-start fw-bolder w-10">
            설비구분
          </div>
          <div class="col col-lg-3">
            <select class="form-select selectBSJ" v-model="equipmentData.eqp_type" @change="searchEquipments">
              <option v-for="(opt, idx) in equipmentData.selectOptions.EQP_TYPE" :key="idx" :value="opt.comm_dtl_cd">
                {{ opt.comm_dtl_nm }}
              </option>
            </select>
          </div>

          <!-- 수리사유 -->
          <div class="col col-lg-2 text-start fw-bolder w-10">
            수리사유
          </div>
          <div class="col col-lg-3">
            <select class="form-select selectBSJ" v-model="equipmentData.repair_reason" @change="searchEquipments">
              <option v-for="(opt, idx) in equipmentData.selectOptions.REPAIR_REASON" :key="idx"
                :value="opt.comm_dtl_cd">
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

  <!--검색모달[S]-->
  <Transition name="fade">
    <Layout :modalCheck="isModal">
      <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
        <h5 class="modal-title">설비 코드 검색</h5>
        <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
      </template>
      <template v-slot:default>
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" :columnDefs="equipDefs"
          :rowData="equipData" @rowClicked="modalClicked" @grid-ready="gridFit" overlayNoRowsTemplate="등록된 설비가 없습니다.">
        </ag-grid-vue>
      </template>
      <template v-slot:footer>
        <button type=" button" class="btn btn-secondary mx-auto" @click="modalOpen">닫기</button>
      </template>
    </Layout>
  </Transition>
  <!--검색모달[E]-->

</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import * as XLSX from 'xlsx';
import debounce from 'lodash/debounce';
import Layout from '../components/modalLayout.vue';


export default {
  name: 'EquipmentRepairList',
  data() {
    return {
      isModal: false,
      selectedEqp: '',
      start_datetime: '',
      end_datetime: '',

      //모달 설비 목록
      equipDefs: [
        { headerName: '설비 코드', field: 'eqp_cd', filter: 'agTextColumnFilter', sortable: true, width: 163, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        {
          headerName: '설비 구분',
          field: 'eqp_type',
          filter: 'agTextColumnFilter',
          sortable: true, width: 163, valueFormatter: (params) => {
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
          sortable: true, width: 163,
          filter: 'agTextColumnFilter',
          cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center',
        },
        {
          headerName: '모델명', field: 'model', filter: 'agTextColumnFilter', sortable: true, width: 163,
          cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center',
        },
      ],

      equipData: [],

      equipmentData: {
        eqp_type: '', // 설비구분
        repair_reason: '', // 수리사유
        eqp_nm: '', // 설비명
        start_time: '',
        end_time: '',

        selectOptions: {
          EQP_TYPE: [], // 설비구분 공통코드
          REPAIR_REASON: [], // 수리사유 공통코드
        },
      },
      rowData: [], // ag-grid의 데이터
      columnDefs: [
        { field: 'eqp_cd', headerName: '설비코드', sortable: true, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        { field: 'eqp_type', headerName: '설비구분', sortable: true, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        { field: 'eqp_nm', headerName: '설비명', sortable: true, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        { field: 'repair_reason', headerName: '수리사유', sortable: true, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        { field: 'repair_parts', headerName: '수리부품', sortable: true, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        { field: 'repair_act', headerName: '수리업체', sortable: true, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        { field: 'note', headerName: '비고', sortable: true, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        { field: 'last_insp_dt', headerName: '최종점검일', sortable: true, valueFormatter: this.$comm.dateFormatter_returnNull, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        { field: 'id', headerName: '등록인 ID', sortable: true, cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center', },
        {
          field: 'start_time',
          headerName: '수리시작일시',
          sortable: true,
          cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center',
          valueFormatter: (params) => this.formatDateTime(params.value), width: 250
        },
        {
          field: 'end_time',
          headerName: '수리종료일시',
          sortable: true,
          cellStyle: { textAlign: 'center' }, headerClass: 'ag-header-center',
          valueFormatter: (params) => this.formatDateTime(params.value), width: 250
        },
        /*
        { field: 'status', headerName: '설비 상태', sortable: true, cellStyle: { textAlign: 'center' },headerClass: 'ag-header-center',
          cellRenderer: (params) => {
            if (params.value === '비가동') {
              return `<i class="fa-solid fa-circle text-danger"></i> ${params.value}`;
            } else if (params.value === '가동') {
              return `<i class="fa-solid fa-circle text-success"></i> ${params.value}`;
            }
            return params.value; // 상태가 비가동/가동이 아닐 경우
          }, 
        },
        */
      ],

      gridOptions: {
        pagination: true,
        paginationAutoPageSize: true, // 표시할 수 있는 행을 자동으로 조절함.
        suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        getRowStyle: (params) => {
          if (!params.data.end_time) {
            return { background: '#ffcccc' }; // 종료시간이 없는 행
          }
          return null;
        },
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
    Layout
  },
  created() {
    // 페이지 제목 저장
    this.$store.dispatch('breadCrumb', { title: '설비 수리 조회' });
    // 공통코드 및 초기 데이터 가져오기
    this.fetchCommonCodes();
    this.fetchFilteredEquip();
  },
  methods: {

    /*모달 [S]*/
    modalOpen() {
      this.isModal = !this.isModal;

      if (this.isModal) {
        this.fetchEquipData(); // 설비 정보 가져오기
      }
    },

    // 설비 정보 가져오기
    async fetchEquipData() {
      try {
        const response = await axios.get('/api/equip'); // API 호출
        this.equipData = response.data; // 데이터 저장
      } catch (error) {
        console.error('설비 정보 가져오기 실패:', error);
      }
    },
    /*
        modalCloseFunc() {
          this.isModal = !this.isModal;
        },
    */

    modalClicked(params) {
      this.selectedEqp = params.data.eqp_cd;
      this.isModal = false;

      // 선택된 설비 코드로 필터링
      this.fetchFilteredEquip(this.start_datetime, this.end_datetime, this.selectedEqp);
    },

    /*모달 [E]*/


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
        const repairReasonResponse = await axios.get('/api/comm/codeList/ER');

        this.equipmentData.selectOptions.EQP_TYPE = [
          { comm_dtl_cd: null, comm_dtl_nm: '전체' }, // "전체" 추가
          ...(eqpTypeResponse.data || []),
        ];
        this.equipmentData.selectOptions.REPAIR_REASON = [
          { comm_dtl_cd: null, comm_dtl_nm: '전체' }, // "전체" 추가
          ...(repairReasonResponse.data || []),
        ];


        // 기본값 설정
        this.equipmentData.eqp_type = null; // "전체"
        this.equipmentData.repair_reason = null;  // "전체"

      } catch (error) {
        console.error('공통코드 가져오기 실패:', error);
      }
    },
    // 필터링된 설비 데이터 가져오기
    async fetchFilteredEquip(start, end, selectedEqp) {
      try {
        const obj = {
          eqp_type: this.equipmentData.eqp_type || null,
          repair_reason: this.equipmentData.repair_reason || null,
          eqp_nm: this.equipmentData.eqp_nm ? `%${this.equipmentData.eqp_nm}%` : null, // 설비명 없으면 null
          start_time: start || null, // 시작 날짜 추가
          end_time: end || null,    // 종료 날짜 추가
          eqp_cd: selectedEqp || null, // 설비코드 추가
        };
        const result = await axios.get('/api/equipList/repair', { params: obj });

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
        console.error('설비 비가동 데이터 조회 실패:', error);
      }
    },
    // 조회 버튼 클릭 시 실행
    searchEquipments: debounce(function () {
      this.fetchFilteredEquip(this.start_datetime, this.end_datetime, this.selectedEqp);
    }, 300), // 300ms 딜레이 설정

    resetBtn() {
      this.selectedEqp = ''; // 설비 코드 입력란 초기화
      this.equipmentData.eqp_type = null; // "전체" 선택
      this.equipmentData.repair_reason = null;  // "전체" 선택
      this.equipmentData.eqp_nm = ''; // 설비명 초기화
      this.start_datetime = ''; // 수리 시작 기간 초기화
      this.end_datetime = ''; // 수리 종료 기간 초기화
      this.fetchFilteredEquip();         // 초기화 후 데이터 조회
    },
    //엑셀 함수
    excelDownload() {
      try {
        // 현재 날짜 생성(엑셀 파일명 용도)
        var today = new Date();
        today = this.$comm.getMyDay(today);

        // 선택된 데이터 가져오기
        let selectedNodes = this.myApi.getSelectedNodes(); // 선택된 행 데이터 가져오기
        let selectedData;

        // 날짜 포맷 함수 (YYYY-MM-DD)
        const formatDate = (date) => {
          return date ? this.$comm.getMyDay(new Date(date)) : '';
        };

        // 날짜 포맷 함수 (시분 포함)
        const formatDateTime = (date) => {
          return date ? this.$comm.getDatetimeMin(new Date(date)) : '';
        };


        if (selectedNodes.length > 0) {
          // 선택된 데이터가 있을 경우
          selectedData = selectedNodes.map(item => ({
            '설비코드': item?.eqp_cd,
            '설비구분': item?.eqp_type,
            '설비명': item?.eqp_nm,
            '설비상태': item?.status,
            '수리사유': item?.repair_reason,
            '수리부품': item?.repair_parts,
            '수리업체': item?.repair_act,
            '최종점검일': formatDate(item?.last_insp_dt),
            '비고': item?.note,
            '등록인ID': item?.id,
            '수리시작일시': formatDateTime(item?.start_time),
            '수리종료일시': formatDateTime(item?.end_time),
          }));
        } else {
          // 선택된 데이터가 없으면 전체 데이터를 사용
          selectedData = this.rowData.map(item => ({
            '설비코드': item?.eqp_cd,
            '설비구분': item?.eqp_type,
            '설비명': item?.eqp_nm,
            '설비상태': item?.status,
            '수리사유': item?.repair_reason,
            '수리부품': item?.repair_parts,
            '수리업체': item?.repair_act,
            '최종점검일': formatDate(item?.last_insp_dt),
            '비고': item?.note,
            '등록인ID': item?.id,
            '수리시작일시': formatDateTime(item?.start_time),
            '수리종료일시': formatDateTime(item?.end_time),
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


        XLSX.utils.book_append_sheet(workBook, workSheet, '설비 수리 조회');
        XLSX.writeFile(workBook, `설비 수리 조회_${today}.xlsx`);
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

.row.mb-4 {
  gap: 10px;
  /* 열 간격 조정 */
  align-items: center;
  /* 수직 가운데 정렬 */
}

.gap-adjustment {
  gap: 5px;
  /* 열 간격 조정 */
}





//그리드 사용시 아래 스타일 임포트
@import '../../../node_modules/ag-grid-community/styles/ag-grid.css';
@import '../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css';
</style>
