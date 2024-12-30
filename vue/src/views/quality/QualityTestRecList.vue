<!-- 품질 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card p-2 mb-3">
      
      <!-- 검사완료목록에서의 검색조건 -->
      <div class="p-4">
        <select-target :modalDefs="searchDefs" :modalTitle="'대상선택'" ref="selectTarget" 
          @changeDivsMore="null" @getModalListMore="null" @modalSelectMore="null"/> <!-- target_type, target_cd 선택 -->

        <div class="row">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">검사번호</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="text" class="form-control" v-model="search.recCd">
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">참조번호</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="text" class="form-control" v-model="search.referCd">
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">검사일시</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="datetime-local" class="form-control" v-model="search.startDt" :max="search.endDt">
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">~</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="datetime-local" class="form-control" v-model="search.endDt" :min="search.startDt">
          </div>
        </div>

        <div class="row">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">불량명</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="text" class="form-control" v-model="search.defNm">
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">담당자</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="search.name">
              <option :value="null" disabled hidden>전체</option>
              <option v-for="(mem) in members" :key="mem.id" :value="mem.name">{{ mem.name }}</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">비고</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="text" class="form-control" v-model="search.note">
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">불량여부</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="search.isDef">
              <option :value="null">전체</option>
              <option :value="true">불량</option>
              <option :value="false">미불량</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col text-center mt-3">
            <button class="btn btn-warning" @click="getRecList">SEARCH</button>
            <button class="btn btn-secondary ms-3" @click="searchReset">RESET</button>
          </div>
        </div>

      </div>

      <!-- 목록 -->
      <ag-grid-vue class="ag-theme-alpine"  :columnDefs="defs" :rowData="rowData" style="height: 320px;"
        @grid-ready="gridFit" :gridOptions="gridOptions" :getRowStyle="getRowStyle" @rowClicked="selectTarget"/>
    </div>
    
    <div class="card">
      <div class="card-header bg-success p-1 text-white fw-bold text-center fs-4">검사결과 조회</div>
      <div class="card-body text-center" v-show="!isRowClicked">선택된 내역이 없습니다.</div>
      <div class="card-body pb-1 pe-0 pe-md-4" v-show="isRowClicked">
        <quality-test-box :isWaitList="false" :selectedTarget="selectedTarget" ref="testBox"/>
      </div>
    </div>

  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";
  import SelectTarget from "../../components/quality/SelectTarget.vue";
  import QualityTestBox from "../../components/quality/QualityTestBox.vue";

  export default {
    name: 'QualityTestRecList',
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},

        // 조회용 검색 grid API 데이터
        searchDefs: [
          { headerName: '유형', field: 'type', width: 100 },
          { headerName: '분류', field: 'cate_type', width: 100 },
          { headerName: '카테고리', field: 'category', width: 100 },
          { headerName: '코드', field: 'cd', width: 100 },
          { headerName: '이름', field: 'nm', width: 266 }
        ],

        // 일반 grid API 데이터
        defs: [
          { headerName: '검사번호', field: 'test_rec_cd' },
          { headerName: '검사일시', field: 'test_dt', 
            valueFormatter: this.$comm.datetimeFormatter,
            minWidth: 145
          },
          { headerName: '참조번호', field: 'refer_cd' },
          { headerName: '제품명', field: 'target_nm' },
          { headerName: '공정명', field: 'proc_nm' },
          { headerName: '생산량', field: 'total_qty', valueFormatter: this.$comm.currencyFormatter },
          { headerName: '합격량', field: 'pass_qty', valueFormatter: this.$comm.currencyFormatter },
          { headerName: '불량양', field: 'def_qty', valueFormatter: this.$comm.currencyFormatter },
          { headerName: '불량명', field: 'def_nm' },
          { headerName: '담당자', field: 'name' }, // id => 이름으로 바꿔 조회한 결과
          { headerName: '불량상태', field: 'def_status' },
          { headerName: '처리자', field: 'complete_name' }, // id => 이름으로 바꿔 조회한 결과
          { headerName: '처리일시', field: 'complete_dt',
            valueFormatter: this.$comm.datetimeFormatter,
            minWidth: 145
          },
        ],
        rowData: [],

        gridOptions: {
          pagination: true,
          paginationAutoPageSize: true,
          overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
          suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        },

        isRowClicked: false, // 기본값 false (표시 안 함)
        selectedTarget: {}, // 목록에서 선택한 대상
        members: [],
        
        // 검사완료목록 조회용 검색조건 값
        search: {
          // targetType: null, // target은 SelectTarget 컴포넌트에서 가져올 수 있음.
          // targetCd: null,
          recCd: null,
          startDt: null,
          endDt: null,
          referCd: null,
          note: null,
          isDef: null,
          defNm: null,
          name: null // 검사 담당자 혹은 불량 처리자
        }
      }
    },

    components: { 
        AgGridVue, // grid API
        SelectTarget,
        QualityTestBox
    },

    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '검사결과 조회'});

      this.getMembers();
      this.getRecList(false);
      this.isRowClicked = false;
    },
    
    methods: {     
      gridFit(params){ // ag-grid @grid-ready 이벤트 발생 시마다 params로 접근해 가로스크롤 삭제
        params.api.sizeColumnsToFit();
      },

      // 품질부서 사원목록 불러오기
      async getMembers(){
        this.members = await this.$comm.getMembers('DPT2');
      },

      // 검사완료목록(품질검사결과) 불러오기
      async getRecList(isSearch){
        // this.search에서 검색조건을 담고 있음.
        // 자식 컴포넌트의 값 포함시키기
        if(isSearch){
          this.search.targetCd = this.$refs.selectTarget.modal_val.cd;
        }

        let result = await axios.get('/api/quality/rec', {params: this.search})
                                .catch(err => console.log(err));
        this.rowData = result.data;
      },

      // 목록에서 타겟 선택 시 검사결과란에 정보 불러오기
      async selectTarget(params){
        let clicked = params.data;
        this.selectedTarget = clicked;
        params.api.redrawRows(); // 그리드 강제 새로고침 (getRowStyle()에서 적용한 행 스타일 즉시 반영)

        await this.$refs.testBox.loadTarget(clicked);
        
        this.isRowClicked = true; // 검사결과 창 open
      }
      
    }
  };
</script>