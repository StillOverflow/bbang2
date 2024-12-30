<!-- 품질 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card p-2 mb-3">
      <div class="card-group">
        <div class="card">
          <div class="card-header p-1 fw-bold text-center fs-4" style="cursor: pointer" 
            :class="activeTab" @click="activeWaitTab">검사대기</div>
        </div>
        <div class="card">
          <div class="card-header p-1 fw-bold text-center fs-4" style="cursor: pointer" 
            :class="activeTabRev" @click="activeCompTab">검사완료</div>
        </div>
      </div>
      
      <!-- 검사완료목록에서의 검색조건 -->
      <div class="p-4" v-show="!isWaitList">
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
          <div class="col text-end">
            <button class="btn btn-warning" @click="getRecList">SEARCH</button>
            <button class="btn btn-secondary ms-3" @click="searchReset">RESET</button>
          </div>
        </div>

      </div>

      <!-- 목록 -->
      <ag-grid-vue class="ag-theme-alpine"  :columnDefs="defs" :rowData="rowData" style="height: 320px;"
        @stateUpdated="gridFit" :gridOptions="gridOptions" :getRowStyle="getRowStyle" @rowClicked="selectTarget"/>
    </div>
    
    <div class="card">
      <div class="card-header bg-success p-1 text-white fw-bold text-center fs-4">검사결과</div>
      <div class="card-body text-center" v-show="!isRowClicked">선택된 내역이 없습니다.</div>
      <div class="card-body pb-1 pe-0 pe-md-4" v-show="isRowClicked">
        <div class="row mb-1 d-flex justify-content-between">

          <div class="col-12 col-md-6 col-xl-3 row text-end p-xl-0">
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">생산번호</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.refer_cd" disabled>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">제품코드</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.target_cd" disabled>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 col-xl-4 mb-2" :style="t_overflow">제품명</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.target_nm" disabled>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">공정코드</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.proc_cd" disabled>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">공정명</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.proc_nm" disabled>
            </div>
          </div>

          <div class="col-12 col-md-6 col-xl-4 mb-2 g-0">
            <div class="card me-4 m-md-0 mb-2 mb-md-2" v-show="samplingTests.length > 0"> <!-- 있을 때만 표시 -->
              <div class="card-header p-1 bg-light fw-bold text-center">검사항목 (샘플링검사)</div>
              <div class="card-body">
                
                <div class="row" v-for="(test, idx) in samplingTests" :key="test.test_cd">
                  <div class="col-6 text-end">
                    <span style="cursor: pointer" :style="t_break" @click="openDtl('샘플링', idx)">
                      {{ test.test_nm }} <i class="fa-solid fa-triangle-exclamation" style="color: #ffc800;" v-show="test.test_value == null">입력</i>
                    </span>
                  </div>
                  <div class="col-6 d-flex" @click="openDtl('샘플링', idx)">
                    <span class="me-1" :style="t_overflow">결과</span>
                    <input type="text" class="form-control w-50 h-75 text-end" v-model="test.test_value" readonly>
                    <span class="ms-2 me-3 text-success fw-bold" :style="t_overflow" v-show="test.isPass">적합</span>
                    <span class="ms-2 me-1 text-danger fw-bold" :style="t_overflow" v-show="test.isPass == false">부적합</span>
                  </div>
                </div>

              </div>
            </div>

            <div class="card me-4 m-md-0" v-show="fullTests.length > 0">
              <div class="card-header p-1 bg-light fw-bold text-center">검사항목 (전수검사)</div> <!-- 있을 때만 표시 -->
              <div class="card-body">

                <div class="row" v-for="(test, idx) in fullTests" :key="test.test_cd">
                  <div class="col-12 text-center mb-2">
                    <span style="cursor: pointer" :style="t_break" @click="openDtl('전수', idx)">
                      {{ test.test_nm }} <i class="fa-solid fa-magnifying-glass" style="color: #969696;"/>
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="col-12 col-md-6 col-xl-2 row text-end g-xl-0">
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-3" :style="t_overflow">생산량</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control text-end" :value="this.$comm.getCurrency(selectedTarget.total_qty)" disabled>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-3" :style="t_overflow" v-show="samplingTests.length > 0">샘플량</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2" v-show="samplingTests.length > 0">
              <input type="text" class="form-control text-end" v-model="test_qty" @change="checkNumberAlert('test')" :disabled="!isWaitList || activeDefect">
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-3" :style="t_overflow">불량양</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2"> <!-- 샘플링검사에서 불량이 난 경우, 별도 입력을 못 함. -->
              <input type="text" class="form-control text-end" v-model="def_qty" @change="checkNumberAlert('def')" :disabled="!isWaitList || !activeDefect">
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 col-xl-4 mb-2 pe-3" :style="t_overflow">합격량</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control text-end" :value="this.$comm.getCurrency(pass_qty)" disabled>
            </div>
          </div>

          <div class="col-12 col-md-6 col-xl-3 row text-end g-xl-0">
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-3" :style="t_break">불량 코드</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="def_cd" disabled>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 col-xl-4 mb-2 pe-3" :style="t_overflow">불량명</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="def_nm" placeholder="선택" @click="modalToggle" :disabled="!isWaitList || def_qty == 0">
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-3" :style="t_overflow">담당자</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <select class="form-select" :disabled="!isWaitList" v-model="id">
                <option :value="null" disabled hidden>선택</option>
                <option v-for="(mem) in members" :key="mem.id" :value="mem.id">{{ mem.name }}</option>
              </select>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-3" :style="t_break">검사 일시</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="datetime-local" class="form-control" v-model="test_dt" :disabled="!isWaitList" :max="this.$comm.getMyDay() + 'T23:59'"> <!-- 최대 오늘 날짜까지 선택 가능 -->
            </div>
          </div>

        </div>
        <div class="row mb-2">
          <div class="col-9 col-md-10 col-xl-11 row">
            <h6 class="col-3 col-md-2 col-xl-1 text-end pe-4 pe-xl-3" :style="t_overflow">비고</h6>
            <div class="col-9 col-md-10 col-xl-11">
              <input type="text" class="form-control" v-model="note" :disabled="!isWaitList">
            </div>
          </div>
          <div class="col-3 col-md-2 col-xl-1 text-end">
            <button class="btn btn-primary" :style="t_overflow" @click="recInsert">SUBMIT</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 불량코드 선택할 모달 -->
    <ModalLayout :modalCheck="isModal">
        <template v-slot:header>
          <h5>불량명 선택</h5>
          <button type="button" aria-label="Close" class="close" @click="modalToggle">×</button>
        </template>
        <template v-slot:default>
          <ag-grid-vue class="ag-theme-alpine" style="height: 520px;" :columnDefs="modalDefs" :rowData="modalData" 
            :gridOptions="gridOptions" @rowClicked="modalSelect"/>
        </template>
        <template v-slot:footer> <!-- 아무것도 안 넣으면 기본 버튼이 표시됨. -->
          <button type="button" class="btn btn-secondary" @click="modalToggle">CLOSE</button>
        </template>
    </ModalLayout>

  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";
  import ModalLayout from "../components/modalLayout.vue";
  import SelectTarget from "../../components/quality/SelectTarget.vue";

  export default {
    name: 'QualityTest',
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},
        
        // 탭 색깔 클래스 바인딩용
        isWaitList: true, // 기본값 true: 검사대기 탭, false: 검사완료 탭

        // 불량 선택 모달 grid API 데이터 (Defs: thead 구성, Data: tbody 구성)
        isModal: false, // 토글기능
        modalDefs: [
          { headerName: '불량코드', field: 'def_cd', width: 90 },
          { headerName: '불량명', field: 'def_nm', width: 120 },
          { headerName: '구분', field: 'def_type_nm', width: 80 },
          { headerName: '내용', field: 'def_detail', width: 220 },
          { headerName: '비고', field: 'note', width: 156 }
        ],
        modalData: [],
        def_nm: null, // 모달에서 선택된 값
        def_cd: null,

        // 조회용 검색 grid API 데이터
        searchDefs: [
          { headerName: '유형', field: 'type', width: 100 },
          { headerName: '분류', field: 'cate_type', width: 100 },
          { headerName: '카테고리', field: 'category', width: 100 },
          { headerName: '코드', field: 'cd', width: 100 },
          { headerName: '이름', field: 'nm', width: 266 }
        ],

        // 일반 grid API 데이터
        defs: [],
        rowData: [],

        gridOptions: {
          pagination: true,
          paginationAutoPageSize: true,
          overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
          suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        },

        // 검사결과 입력에 필요한 데이터
        isRowClicked: false, // 기본값 false (표시 안 함)
        selectedTarget: {}, // 목록에서 선택한 대상
        
        samplingTests: [], // 선택한 대상의 검사항목 중 샘플링검사 유형
        fullTests: [], // 선택한 대상의 검사항목 중 전수검사 유형
        members: [], // 품질부서의 사원들
        
        test_qty: null,
        def_qty: 0,
        test_dt: null,
        id: null, // 선택된 담당자 사원번호
        note: null,

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

    computed: { // this.로 참조하려면 data 생성 후 computed에서 계산되어야 함.
      // 탭 색깔 클래스 바인딩용
      activeTab(){ 
        return {'bg-success': this.isWaitList, 'bg-light': !this.isWaitList, 'text-white': this.isWaitList}
      },
      activeTabRev(){
        return {'bg-success': !this.isWaitList, 'bg-light': this.isWaitList, 'text-white': !this.isWaitList}
      },

      // 샘플링검사에서의 전체 적합 여부 판단
      isAllPass(){
        let stLength = this.samplingTests.length;
        
        if(stLength > 0){ // 샘플링검사가 있는 경우만 확인
          let passCnt = 0;
          this.samplingTests.forEach((test) => {
            if(test.isPass == true) passCnt++;
          });
          
          if(passCnt == stLength){
            return true;
          } else return false;
        }
        return null;
      },

      // 검사방식별 불량양 입력가능여부 조작
      activeDefect(){
        let stLength = this.samplingTests.length;
        let fullLength = this.fullTests.length;
        
        if(stLength > 0 && fullLength > 0){ // 샘플링검사와 전수검사가 동시에 있는 경우
          if(this.isAllPass) return true;
          else return false; // 샘플링검사에서 하나라도 부적합인 경우 전수검사도 입력 불가

        } else if(stLength > 0){ // 샘플링검사만 있는 경우 입력 불가
          return false;
        }
        return true; // 전수검사만 있는 경우 입력 가능
      },

      // 합격량 자동계산
      pass_qty(){
        return this.selectedTarget.total_qty - this.def_qty;
      }
    },

    components: { 
        AgGridVue, // grid API
        ModalLayout,
        SelectTarget
    },

    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '제품 품질검사'});

      // 기본 탭: 검사대기탭 그리드 데이터 불러오기
      this.getMembers();
      this.activeWaitTab();
    },
    
    methods: {     
      gridFit(params){ // ag-grid @stateUpdated 이벤트 발생 시마다 params로 접근해 가로스크롤 삭제
        params.api.sizeColumnsToFit();
      },

      async activeWaitTab(){ // 검사대기목록 활성화
        await this.getWaitList();
        if(!this.isWaitList){
          this.isWaitList = true;
        }
        this.isRowClicked = false;

        this.defs = [ // 그리드 표시 컬럼 변경
          { headerName: '생산번호', field: 'refer_cd' }, // 생산실적 번호
          { headerName: '생산일시', field: 'end_time', 
            valueFormatter: this.$comm.datetimeFormatter,
            minWidth: 145
          }, // 공정 완료된 일시
          { headerName: '제품코드', field: 'target_cd' },
          { headerName: '제품명', field: 'target_nm' },
          { headerName: '공정코드', field: 'proc_cd' },
          { headerName: '공정명', field: 'proc_nm' },
          { headerName: '생산량', field: 'total_qty' ,valueFormatter: this.$comm.currencyFormatter }
        ];
      },
      
      async activeCompTab(){ // 검사완료목록 활성화
        await this.getRecList();
        if(this.isWaitList){
          this.isWaitList = false;
        }
        this.isRowClicked = false;

        this.defs = [ // 그리드 표시 컬럼 변경
          { headerName: '검사번호', field: 'test_rec_cd' },
          { headerName: '검사일시', field: 'test_dt', 
            valueFormatter: this.$comm.datetimeFormatter,
            minWidth: 145
          },
          { headerName: '참조번호', field: 'refer_cd' },
          { headerName: '제품명', field: 'target_nm' },
          { headerName: '공정명', field: 'proc_nm' },
          { headerName: '생산량', field: 'total_qty' },
          { headerName: '합격량', field: 'pass_qty' },
          { headerName: '불량양', field: 'def_qty' },
          { headerName: '불량명', field: 'def_nm' },
          { headerName: '담당자', field: 'name' }, // id => 이름으로 바꿔 조회한 결과
          { headerName: '불량상태', field: 'def_status_nm' },
          { headerName: '처리자', field: 'complete_name' }, // id => 이름으로 바꿔 조회한 결과
          { headerName: '처리일시', field: 'complate_dt',
            valueFormatter: this.$comm.datetimeFormatter,
            minWidth: 145
          },
        ];
      },

      // 품질부서 사원목록 불러오기
      async getMembers(){
        this.members = await this.$comm.getMembers('DPT2');
      },

      // 검사대기목록 불러오기
      async getWaitList(){
        let waitResult = await axios.get('/api/quality/rec/wait')
                                    .catch(err => console.log(err));
        this.rowData = waitResult.data;
      },

      // 검사완료목록(품질검사결과) 불러오기
      async getRecList(){
        // this.search에서 검색조건을 담고 있음.
        // 자식 컴포넌트의 값 포함시키기
        this.search.targetType = this.$refs.selectTarget.selected_radio;
        this.search.targetCd = this.$refs.selectTarget.modal_val.cd;

        let result = await axios.get('/api/quality/rec', {params: this.search})
                                .catch(err => console.log(err));
        this.rowData = result.data;
      },

      // 목록에서 타겟 선택 시 검사결과란에 정보 불러오기
      async selectTarget(params){
        let clicked = params.data;
        this.selectedTarget = clicked;
        params.api.redrawRows(); // 그리드 강제 새로고침 (getRowStyle()에서 적용한 행 스타일 즉시 반영)

        // 초기화
        this.isDefect = null;
        this.test_qty = null;
        this.pass_qty = null;
        this.def_qty = 0;
        this.samplingTests = []; ///////////////////////// 빠르게 타겟 변경 시 배열이 비워지지 않는 오류가 있음.
        this.fullTests = [];

        // 검사항목 불러오기
        if(clicked.is_last == 1 || clicked.target_type == 'P03'){ // 마지막 공정일 경우 공정별+완제품 검사를 동시에 해야 함.
          await this.getTests(clicked, 'P03');
          await this.getTests(clicked, 'P02');
        } else {
          await this.getTests(clicked, 'P02');
        }

        // 검사완료목록일 경우 상세 측정결과값 가져오기
        if(!this.isWaitList){
          let result = await axios.get('/api/quality/rec/dtl', {params: {test_rec_cd: clicked.test_rec_cd}})
                                  .catch(err => console.log(err));
          let data = result.data;
          if(data){ // 값이 있다면 샘플링테스트 측정값에 넣기
            this.samplingTests.forEach((test) => {
              if(test.test_cd == data.test_cd) test.test_value = data.test_value;
            });
          }
        }
        
        this.isRowClicked = true; // 검사결과 창 open
      },
      
      // 검사할 항목들을 얻어 검사방식에 따라 샘플림검사/전수검사 분리하기
      async getTests(target, type){
        let query = null;
        
        if(type == 'P03'){  
          query = {cd: target.target_cd, type: type}; // P03: 완제품대상 검사항목
        } else {
          query = {cd: target.proc_cd, type: type}; // P02: 공정대상 검사항목
        }

        let testLists = await axios.get('/api/quality/test/my', {params: query}) // 해당 품질기준의 검사항목 불러옴
                                    .catch(err => console.log(err));
       
        testLists.data.forEach((test) => {
          test.isPass = null; // 적합/부적합 판단용
        
          if(test.test_metd == 'O01'){ 
            this.samplingTests.push(test); // O01: 샘플링검사일 경우
            let testQty = target.total_qty * 0.01;
            this.test_qty = testQty < 5 ? 5 : testQty; // 샘플량을 전체에서 1%로 자동 입력하되, 적어도 5개는 되어야 함.
          } else { 
            this.fullTests.push(test); // O02: 전수검사인 경우
          }
        });
      },

      // 그리드 속성으로 선택된 행 색깔 변경
      getRowStyle(params){
        if((this.isWaitList && params.data.refer_cd == this.selectedTarget.refer_cd)
            || (!this.isWaitList && params.data.test_rec_cd == this.selectedTarget.test_rec_cd)){
          return {backgroundColor: '#d6d6d6'}
        }
      },

      // 각 검사항목 클릭 시 측정값 입력 혹은 상세정보 표시
      async openDtl(testMetd, idx){
        if(testMetd == '샘플링' && this.isWaitList){
          let test = this.samplingTests[idx];
          let passMin = !test.pass_min ? 0 : test.pass_min;
          let passMax = !test.pass_max ? 0 : test.pass_max;
          let percent = test.pass_ispercent == 'A01' ? '%' : '';

          // swal에서 제공하는 input 모달 이용 (testVal에 입력결과를 담음)
          let { value: testVal } = await this.$swal({
            title: `<h4>${test.test_nm} 검사</h4>`,
            text: test.test_dtl,
            input: "text", // 입력유형
            inputValue: !test.test_value ? 0 : test.test_value, // 기본값
            inputAttributes: {
              style: "text-align: right",
              autocomplete: 'off'
            },
            inputLabel: `적합범위 : ${passMin + percent} ~ ${passMax + percent}`,
            showCancelButton: true,
            cancelButtonText: 'CLOSE',
            confirmButtonText: 'SAVE',
            confirmButtonColor: '#2dce89',
            inputValidator: (value) => {
              if(!value){
                return "측정값을 입력해주세요.";
              } else if(isNaN(value)) {
                return "측정값은 숫자로 입력해주세요.";
              }
            }
          });

          if(testVal){ // 값이 정상적으로 입력되었을 때의 후처리
            let val = Number(testVal);
            test.test_value = val;
            
            // 적합/부적합 평가하여 반영
            if(val >= passMin && val <= passMax){
              test.isPass = true;
              if(this.isAllPass) this.def_qty = 0; // 전부 적합일 시 불량양 0
            } else {
              test.isPass = false;
              // 샘플링검사 한 개라도 부적합 시 전량 불량
              this.def_qty = this.selectedTarget.total_qty;
            }
          }
        } else if(testMetd == '샘플링'){ // 검사완료목록일 경우
          this.$swal({
            title: `<h4>${this.samplingTests[idx].test_nm} 검사</h4>`,
            text: this.samplingTests[idx].test_dtl,
            showConfirmButton: false
          });
        } else {
          this.$swal({
            title: `<h4>${this.fullTests[idx].test_nm} 검사</h4>`,
            text: this.fullTests[idx].test_dtl,
            showConfirmButton: false
          });
        }
      },

      // input text에서 숫자 유효성 확인용
      checkNumberAlert(target){
        let val = null;
        if(target == 'def') val = !this.def_qty ? 0 : this.def_qty; // 입력값 null이면 0으로 취급
        else if(target == 'test') val = this.test_qty;

        if(isNaN(val)){ // 숫자가 아닌 경우
          this.$swal(
            '입력 오류',
            `숫자를 정확히 입력해주세요.`,
            'warning'
          );
          val = 0; // 숫자 아니면 0으로 돌려줌.
        } else if(val < 0){
          val = val * -1; // 입력값이 음수면 양수로 변환
        }
        if(val > this.selectedTarget.total_qty){ // 입력값이 생산량보다 많다면 최대값 적용
          val = this.selectedTarget.total_qty;
        }

        if(target == 'def') this.def_qty = Number(val);
        else if(target == 'test') this.test_qty = val < 5 ? 5 : Number(val); // 샘플량은 최소 5개 이상이어야 함.
      },

      // ------------ 불량 선택 모달 메소드 ------------
      modalToggle(){
        this.isModal = !this.isModal;
        this.getModalList();
      },

      async getModalList(){ // 불량목록 불러오기
        let params = {
          type: 'P02', // 불량유형: 공정중
          subType: this.selectedTarget.is_last == 1 ? 'P03' : null // 마지막 공정일 시 불량유형: 제품도 함께 조회
        }; 
        
        let result = await axios.get('/api/quality/defect', {params: params})
                                .catch(err => console.log(err));
        this.modalData = result.data;
      },
      
      modalSelect(params){
        let selected = params.data;
        this.def_cd = selected.def_cd;
        this.def_nm = selected.def_nm;
        this.modalToggle();
      },
      // ---------- 불량 선택 모달 메소드 끝 -----------

      async recInsert(){
        // 등록할 값들을 모은 객체 선언
        let dtlArr = []; // 샘플링검사가 있을 경우 디테일 등록용
        if(this.samplingTests.length > 0){
          let isAllTested = true; // 모든 검사값이 입력되었는지 확인용

          this.samplingTests.forEach((test) => {
            if(test.test_value == null){
              isAllTested = false;
              return; // 하나라도 미입력되었으면 반복문 탈출
            }
            
            dtlArr.push({
              test_cd: test.test_cd,
              test_value: test.test_value
            });
          });

          if(!isAllTested){
            this.$swal(
              '검사결과 미입력',
              `샘플링검사 결과값을 모두 입력해주세요.`,
              'warning'
            );
            return;
          }
        }

        let target = this.selectedTarget;
        let isLast = target.is_last == 1; // 값이 1인 경우 boolean 타입 true로 담음.

        // 유효성 검사
        if(this.def_qty > 0 && !this.def_cd){ // 불량양이 있는데 불량코드를 선택하지 않은 경우
          this.$swal(
            '불량명 미선택',
            `불량명을 선택하지 않았습니다.`,
            'warning'
          );
          return;
        } else if(!this.id){ // 담당자를 선택하지 않은 경우
          this.$swal(
            '담당자 미선택',
            `검사 담당자가 선택되지 않았습니다.`,
            'warning'
          );
          return;
        } else if(!this.test_dt){ // 검사일시를 선택하지 않은 경우
          this.$swal(
            '검사일시 미입력',
            `검사일시가 입력되지 않았습니다.`,
            'warning'
          );
          return;
        }
        
        let headerObj = { // 헤더 등록용
          test_dt: this.test_dt.replace('T', ' '), // 날짜 DB형식으로 바꿈 
          refer_cd: target.refer_cd, 
          target_type: isLast ? 'P03' : 'P02', // 마지막 공정에서의 검사는 P03(완제품검사)으로 입력 
          target_cd: target.target_cd, 
          proc_cd: target.proc_cd,
          total_qty: target.total_qty, 
          test_qty: this.test_qty, 
          pass_qty: this.pass_qty, 
          def_qty: this.def_qty,
          id: this.id, 
          def_cd: this.def_qty > 0 ? this.def_cd : null, // def_cd가 있더라도 불량양이 없으면 null 입력
          note: this.note
        };

        let result = await axios.post('/api/quality/rec', {header: headerObj, dtl: dtlArr})
                                .catch(err => console.log(err));

        if(result.data == 'success'){
          this.$swal(
            '등록완료',
            '검사결과가 등록되었습니다.',
            'success'
          );
          // 후처리: 입력완료한 내역은 목록에서 사라져야 함.
          // filter 메소드로 현재 입력한 것을 제외한 내역만 남김
          let newArr = this.rowData.filter(obj => obj.refer_cd != target.refer_cd);
          this.rowData = newArr; // 변경한 배열로 반영
          this.isRowClicked = false; // 결과 창 닫기
        } else {
          this.$swal(
            '오류발생',
            '검사결과를 등록하지 못했습니다.',
            'error'
          );
        }
      },


      // 조회용 메소드
           
      // 검색조건 초기화 버튼 동작
      searchReset(){
        // search 객체의 값을 모두 null로 초기화
        let keys = Object.keys(this.search);
        keys.forEach((key) => this.search[key] = null);

        // 자식컴포넌트의 값도 모두 초기화
        this.$refs.selectTarget.selected_radio = null;
        this.$refs.selectTarget.modal_val = {};
        this.$refs.selectTarget.changeDivs();
      }

    }
  };
</script>

<style>
  .textRed {
    color : red;
    font-weight: bold;
    text-align: center;
  }
  .textGreen {
    color : rgb(13, 184, 13);
    text-align: center;
  }
</style>