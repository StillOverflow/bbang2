<!-- 품질 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
  
      <div class="card-header bg-light ps-5 ps-md-4">
        <div class="row">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">검사명</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="text" class="form-control" v-model="search.testNm">
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">검사내용</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="text" class="form-control" v-model="search.testDtl">
          </div>

          <h6 class="col-2 col-xxl-1 mb-2 d-flex justify-content-center align-items-center" :style="t_overflow">검사방식</h6>
          <div class="form-check col-10 col-xxl-5 d-flex align-items-center">
            <div>
              <input class="form-check-input ms-1" type="radio" v-model="search.testMetd" :value="null" :id="'metdNull'">
              <label class="form-check-label ms-1 me-3 text-start" :for="'metdNull'">
                전체
              </label>
            </div>
            <div v-for="(opt, idx) in testMetds" :key="idx">
              <input class="form-check-input ms-1" type="radio" v-model="search.testMetd" :value="opt.comm_dtl_cd" :id="'metd' + opt.comm_dtl_cd">
              <label class="form-check-label ms-1 me-3 text-start" :for="'metd' + opt.comm_dtl_cd">
                {{opt.comm_dtl_nm}}
              </label>
            </div>
          </div>
        </div>

        <div class="row">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">사용상태</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="search.status">
              <option :value="null">전체</option>
              <option :value="'A01'">사용</option>
              <option :value="'A02'">미사용</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">노출여부</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="search.useStatus">
              <option :value="null">전체</option>
              <option :value="'A01'">노출중</option>
              <option :value="'A02'">미노출</option>
            </select>
          </div>

          <h6 class="col-2 col-xxl-1 mb-2 d-flex justify-content-center align-items-center" :style="t_overflow">적용대상</h6>
          <div class="form-check col-10 col-xxl-5 d-flex align-items-center">
            <div>
              <input class="form-check-input ms-1" type="radio" v-model="search.targetType" :value="null" :id="'targetTypeNull'">
              <label class="form-check-label ms-1 me-3 text-start" :for="'targetTypeNull'">
                전체
              </label>
            </div>
            <div v-for="(opt, idx) in targetTypes" :key="idx">
              <input class="form-check-input ms-1" type="radio" v-model="search.targetType" :value="opt.comm_dtl_cd" :id="'targetType' + opt.comm_dtl_cd">
              <label class="form-check-label ms-1 me-3 text-start" :for="'targetType' + opt.comm_dtl_cd">
                {{opt.comm_dtl_nm}}
              </label>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col text-center mt-3">
            <button class="btn btn-warning" @click="getList">SEARCH</button>
            <button class="btn btn-secondary ms-3" @click="searchReset">RESET</button>
          </div>
        </div>
      </div>
      
      <!-- 목록 -->
      <div class="card-body">
        <button class="btn btn-outline-secondary btn-sm me-3 mb-2">선택 노출</button>
        <button class="btn btn-outline-secondary btn-sm mb-2">선택 미노출</button>
        <ag-grid-vue class="ag-theme-alpine" style="height: 605px" :columnDefs="defs" :rowData="rowData" 
          @grid-ready="gridFit" @rowClicked="rowClicked" :gridOptions="gridOptions"/>
      </div>
    </div>

    <!-- 검사항목 모달 -->
    <ModalLayout :modalCheck="isModal">
        <template v-slot:header>
        <h5>검사항목 상세</h5>
        <button type="button" aria-label="Close" class="close" @click="modalToggle">×</button>
        </template>
        <template v-slot:default>

          <div class="row g-2">
            <h6 class="col-4 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">검사항목코드</h6>
            <div class="col-6 mb-2">
              <input type="text" class="form-control" v-model="selected.test_cd" readonly>
            </div>
            <h6 class="col-4 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">검사명</h6>
            <div class="col-6 mb-2">
              <input type="text" class="form-control" v-model="selected.test_nm">
            </div>
            <h6 class="col-4 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">검사내용</h6>
            <div class="col-6 mb-2">
              <input type="text" class="form-control" v-model="selected.test_dtl">
            </div>

            <h6 class="col-4 mb-2 d-flex justify-content-center align-items-center" :style="t_overflow">검사방식</h6>
            <div class="form-check col-8 d-flex align-items-center">
              <div v-for="(opt, idx) in testMetds" :key="idx">
                <input class="form-check-input ms-1" type="radio" v-model="selected.test_metd" :value="opt.comm_dtl_cd" :id="'m_metd' + opt.comm_dtl_cd">
                <label class="form-check-label ms-1 me-3 text-start" :for="'m_metd' + opt.comm_dtl_cd">
                  {{opt.comm_dtl_nm}}
                </label>
              </div>
            </div>

            <h6 class="col-4 mb-2 d-flex justify-content-center align-items-center" :style="t_overflow">적용대상</h6>
            <div class="form-check col-8 d-flex align-items-center">
              <div v-for="(opt, idx) in targetTypes" :key="idx">
                <input class="form-check-input ms-1" type="checkbox" v-model="selected.target_type" :value="opt.comm_dtl_cd" :id="'m_metd' + opt.comm_dtl_cd">
                <label class="form-check-label ms-1 me-3 text-start" :for="'m_metd' + opt.comm_dtl_cd">
                  {{opt.comm_dtl_nm}}
                </label>
              </div>
            </div>

            <h6 class="col-4 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">등록일자</h6>
            <div class="col-6 mb-2">
              <input type="text" class="form-control" v-model="selected.create_dt">
            </div>
          </div>

        </template>
        <template v-slot:footer> <!-- 아무것도 안 넣으면 기본 버튼이 표시됨. -->
          <!-- 저장버튼 -->
        <button type="button" class="btn btn-secondary" @click="modalToggle">CLOSE</button>
        </template>
    </ModalLayout>

  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";
  import ModalLayout from "../components/modalLayout.vue";

  export default {
    name: 'QualityTestManagement',
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},

        // 모달용
        isModal: false, // 토글기능
        selected: {
          test_cd: null,
          test_nm: null,
          test_dtl: null,
          test_metd: null,
          target_type: [],
          create_dt: null,
        },

        // 일반 grid API 데이터
        defs: [
          { headerName: '코드', field: 'test_cd', maxWidth: 70 },
          { headerName: '검사명', field: 'test_nm', maxWidth: 140 },
          { headerName: '검사방식', field: 'test_metd_nm', maxWidth: 100 },
          { headerName: '적용대상', field: 'target_type_nm', maxWidth: 100 },
          { headerName: '검사내용', field: 'test_dtl', cellClass: 'text-overflow' },
          { headerName: '사용', field: 'status_nm', maxWidth: 70 },
          { headerName: '노출', field: 'use_status_nm', maxWidth: 70 },
          { headerName: '등록일', field: 'create_dt', valueFormatter: this.$comm.dateFormatter, maxWidth: 100 },
          { headerName: '수정일', field: 'update_dt', valueFormatter: this.$comm.dateFormatter_returnNull, maxWidth: 100 },
        ],
        rowData: [],
        gridApi: null,
        colApi: null,

        gridOptions: {
          pagination: true,
          paginationAutoPageSize: true,
          overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
          suppressMovableColumns: true, // 컬럼 드래그 이동 방지
          rowSelection: { 
            mode: 'multiRow'
          }
        },

        testMetds: [],
        targetTypes: [],

        // 검색조건 값
        search: {
          testNm: null,
          testDtl: null,
          testMetd: null,
          status: null,
          useStatus: null,
          targetType: null
        }
      }
    },

    components: { 
        AgGridVue, // grid API
        ModalLayout
    },

    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '검사항목 관리'});
      
      this.getList();
      this.getRadios();
    },

    methods: {
      gridFit(params){ // @grid-ready 시 매개변수 속성으로 자동 접근, 가로스크롤 삭제
        params.api.sizeColumnsToFit();
        this.gridApi = params.api;
        this.colApi = params.columnApi;
      },

      // 공통코드 가져오기
      async getRadios(){
        // 검사방식 목록 불러오기
        this.testMetds = await this.$comm.getComm('QM');
        // 적용대상 목록 불러오기
        this.targetTypes = await this.$comm.getComm('QT');
      },

      // 검사항목 목록 가져오기
      async getList(){
        let result = await axios.get('/api/quality/test/all', {params: this.search}) // 검색조건 있다면 반영
                                .catch(err => console.log(err));
        this.rowData = result.data;
      },

      // 검색조건 초기화 버튼 동작
      searchReset(){
        // search 객체의 값을 모두 null로 초기화
        let keys = Object.keys(this.search);
        keys.forEach((key) => this.search[key] = null);
      },
      
      // 검사항목 상세 모달 띄우기
      rowClicked(params){ // @rowClicked
        let data = params.data;
        this.selected = {
          test_cd: data.test_cd,
          test_nm: data.test_nm,
          test_dtl: data.test_dtl,
          test_metd: data.test_metd,
          target_type: [data.target_type],
          create_dt: this.$comm.getMyDay(data.create_dt)
        };
        this.modalToggle();
      },

      // ------------ 모달 메소드 ------------
      modalToggle(){
        this.isModal = !this.isModal;
      },

      async getModalList(){
        
      },
      // ---------- 모달 메소드 끝 -----------

    }
  };
</script>

<style>
  .text-overflow {
    white-space: nowrap;
    overflow: hidden;
  }
</style>