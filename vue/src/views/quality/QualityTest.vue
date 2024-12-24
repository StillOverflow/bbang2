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
      <ag-grid-vue class="ag-theme-alpine" style="height: 268px;" :columnDefs="waitDefs" :rowData="waitData" 
        @grid-ready="gridFit" :gridOptions="gridOptions" :getRowStyle="getRowStyle" @rowClicked="selectTarget"/>
    </div>
    
    <div class="card">
      <div class="card-header bg-success p-1 text-white fw-bold text-center fs-4">검사결과</div>
      <div class="card-body text-center" v-show="!isRowClicked">선택된 내역이 없습니다.</div>
      <div class="card-body pb-1 pe-0 pe-md-4" v-show="isRowClicked">
        <div class="row mb-1 d-flex justify-content-between">

          <div class="col-12 col-md-6 col-xl-3 row text-end p-xl-0">
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">생산번호</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.prod_result_cd" readonly>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">제품코드</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.prd_cd" readonly>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 col-xl-4 mb-2" :style="t_overflow">제품명</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.prd_nm" readonly>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">공정코드</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.inst_proc_cd" readonly>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">공정명</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.proc_nm" readonly>
            </div>
          </div>

          <div class="col-12 col-md-6 col-xl-4 mb-2 g-0">
            <div class="card me-4 m-md-0 mb-2 mb-md-2" v-show="samplingTests.length > 0"> <!-- 있을 때만 표시 -->
              <div class="card-header p-2 bg-light fw-bold text-center">검사항목 (샘플링검사)</div>
              <div class="card-body p-2">
                
                <div class="row" v-for="(test, idx) in samplingTests" :key="test.test_cd">
                  <div class="col-3">
                    <span style="cursor: pointer" :style="t_break" @click="openDtl('샘플링', idx)">{{ test.test_nm }}</span>
                  </div>
                  <div class="col-9 form-check p-0 d-flex">
                      <input class="form-check-input ms-4" type="radio" v-model="test.test_value" :value="true" :id="'true' + test.test_cd" :disabled="!isWaitList">
                      <label class="form-check-label ms-2 me-1 text-start" :for="'true' + test.test_cd" :style="t_overflow">적합</label>
                      <input class="form-check-input ms-2" type="radio" v-model="test.test_value" :value="false" :id="'false' + test.test_cd" :disabled="!isWaitList">
                      <label class="form-check-label ms-2 me-4 text-start" :for="'false' + test.test_cd" :style="t_overflow">부적합</label>
                  </div>
                </div>

              </div>
            </div>

            <div class="card me-4 m-md-0" v-show="fullTests.length > 0">
              <div class="card-header p-2 bg-light fw-bold text-center">검사항목 (전수검사)</div> <!-- 있을 때만 표시 -->
              <div class="card-body">
                <div class="form-check p-0 d-flex justify-content-end" v-for="(test, idx) in fullTests" :key="test.test_cd">
                  <span style="cursor: pointer" :style="t_break" @click="openDtl('전수', idx)">{{ test.test_nm }}</span>
                  <input class="form-check-input ms-4" type="radio" v-model="test.test_value" :value="true" :id="'true' + test.test_cd" :disabled="!isWaitList">
                  <label class="form-check-label ms-2 me-1 text-start" :for="'true' + test.test_cd" :style="t_overflow">적합</label>
                  <input class="form-check-input ms-2" type="radio" v-model="test.test_value" :value="false" :id="'false' + test.test_cd" :disabled="!isWaitList">
                  <label class="form-check-label ms-2 me-4 text-start" :for="'false' + test.test_cd" :style="t_overflow">부적합</label>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6 col-xl-3 row text-end p-xl-0">
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">생산량</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control text-end" :value="this.$comm.getCurrency(selectedTarget.prod_qty)" readonly>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">검사량</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control text-end" v-model="test_qty" :disabled="!isWaitList">
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 col-xl-4 mb-2" :style="t_overflow">합격량</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control text-end" v-model="pass_qty" :disabled="!isWaitList">
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">불량양</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control text-end" v-model="def_qty" :disabled="!isWaitList">
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">검사일시</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="datetime-local" class="form-control" v-model="complete_dt" :disabled="!isWaitList" :max="this.$comm.getMyDay() + 'T23:59'"> <!-- 최대 오늘 날짜까지 선택 가능 -->
            </div>
          </div>

          <div class="col-12 col-md-6 col-xl-2 row text-end g-xl-0">
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-4" :style="t_overflow">단위</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="'kg?? ea??'" readonly>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-3" :style="t_break">불량 코드</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="null" readonly>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 col-xl-4 mb-2 pe-4" :style="t_overflow">불량명</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="null" placeholder="선택" @click="modalToggle" :disabled="!isWaitList">
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-4" :style="t_overflow">담당자</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <select class="form-select" :disabled="!isWaitList" v-model="id">
              <option :value="null" disabled hidden>선택</option>
              <option v-for="(mem) in members" :key="mem.id" :value="mem.id">{{ mem.name }}</option>
            </select>
            </div>
          </div>

        </div>
        <div class="row">
          <div class="col-9 col-md-10 col-xl-11 row">
            <h6 class="col-3 col-md-2 col-xl-1 text-end pe-4 pe-xl-3" :style="t_overflow">비고</h6>
            <div class="col-9 col-md-10 col-xl-11">
              <input type="text" class="form-control" :value="note" :disabled="!isWaitList">
            </div>
          </div>
          <div class="col-3 col-md-2 col-xl-1 text-end">
            <button class="btn btn-primary" :style="t_overflow" @click="null">SUBMIT</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 불량코드 선택할 모달 -->
    <ModalLayout :modalCheck="isModal">
        <template v-slot:header>
          <h5>불량내용 선택</h5>
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

  export default {
    name: 'QualityTest',
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},
        
        // 탭 색깔 클래스 바인딩용
        isWaitList: true, // 기본값 true: 검사대기 탭, false: 검사완료 탭

        // 모달 내부 grid API 데이터 (Defs: thead 구성, Data: tbody 구성)
        isModal: false, // 토글기능
        modalDefs: [],
        modalData: [],
        modal_val: { // 선택된 값
          nm: null,
          cd: null
        },

        // 일반 grid API 데이터
        waitDefs: [
          { headerName: '생산번호', field: 'prod_result_cd' }, // 생산실적 번호
          { headerName: '생산일자', field: 'end_time' }, // 생산지시서에서 완료상태가 된 일자
          { headerName: '제품코드', field: 'prd_cd' },
          { headerName: '제품명', field: 'prd_nm' },
          { headerName: '공정코드', field: 'inst_proc_cd' },
          { headerName: '공정명', field: 'proc_nm' },
          { headerName: '생산량', field: 'prod_qty' ,valueFormatter: this.$comm.currencyFormatter }
        ],
        waitData: [],
        waitApi: null,

        gridOptions: {
          pagination: true,
          paginationAutoPageSize: true,
          overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
          suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        },

        // 검사결과 입력에 필요한 데이터
        isRowClicked: true, // 기본값 false (표시 안 함)
        selectedTarget: {}, // 목록에서 선택한 대상
        
        samplingTests: [], // 선택한 대상에 품질기준으로 적용된 검사항목 중 샘플링검사 유형
        fullTests: [], // 선택한 대상에 품질기준으로 적용된 검사항목 중 전수검사 유형
        members: [], // 품질부서의 사원들
        
        test_qty: null,
        pass_qty: null,
        def_qty: null,
        complete_dt: null,
        id: null, // 선택된 담당자 사원번호
        note: null,
      }
    },

    computed: { // this.로 data(){} 참조하려면 data 생성 후 computed에서 계산되어야 함.
      // 탭 색깔 클래스 바인딩용
      activeTab(){ 
        return {'bg-success': this.isWaitList, 'bg-light': !this.isWaitList, 'text-white': this.isWaitList}
      },
      activeTabRev(){
        return {'bg-success': !this.isWaitList, 'bg-light': this.isWaitList, 'text-white': !this.isWaitList}
      }
    },

    components: { 
        AgGridVue, // grid API
        ModalLayout
    },

    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '제품 품질검사'});

      // 그리드 데이터 불러오기
      this.getWaitGrid();
    },

    methods: {     
      activeWaitTab(){ // 검사대기목록 활성화
        if(!this.isWaitList){
          this.isWaitList = true;
        }
      },

      activeCompTab(){ // 검사완료목록 활성화
        if(this.isWaitList){
          this.isWaitList = false;
        }
      },

      gridFit(params){ // @grid-ready 시 매개변수 속성으로 자동 접근, 가로스크롤 삭제
        params.api.sizeColumnsToFit();
        this.waitApi = params.api;
      },

      // 검사대기목록 불러오기
      async getWaitGrid(){
        let waitResult = await axios.get('/api/quality/rec/wait')
                                    .catch(err => console.log(err));
        this.waitData = waitResult.data;
      },

      // 목록에서 타겟 선택 시 검사결과란에 정보 불러오기
      async selectTarget(params){
        let clicked = params.data;
        this.selectedTarget = clicked;
        params.api.redrawRows(); // 그리드 강제 새로고침 (getRowStyle()에서 적용한 행 스타일 즉시 반영)

        // 초기화
        this.samplingTests = [];
        this.fullTests = [];

        // 검사항목 불러오기
        if(clicked.is_last == 1){ // 마지막 공정일 경우 공정별+완제품 검사를 동시에 해야 함.
          this.getTests(clicked, 'P03');
          this.getTests(clicked, 'P02');
        } else {
          this.getTests(clicked, 'P02');
        }

        this.members = await this.$comm.getMembers('DPT2'); // 품질부서 사원목록 불러오기
        this.isRowClicked = true; // 검사결과 창 open
      },
      
      // 검사할 항목들을 얻어 검사방식에 따라 샘플림검사/전수검사 분리하기
      async getTests(target, type){
        let query = null;
        
        if(type == 'P03'){
          query = {cd: target.prd_cd, type: type}; // P03: 완제품대상 검사항목 
        } else {
          query = {cd: target.inst_proc_cd, type: type}; // P02: 공정대상 검사항목
        }

        let testLists = await axios.get('/api/quality/test/my', {params: query}) // 해당 품질기준의 검사항목 불러옴
                                    .catch(err => console.log(err));

        testLists.data.forEach((test) => {
          test.test_value = null; // 적합/부적합 판단용
        
          if(test.test_metd == 'O01'){ 
            this.samplingTests.push(test); // 샘플링검사일 경우
          } else { 
            this.fullTests.push(test); // 전수검사인 경우
          }
        });
      },

      // 목록에서 선택된 행 색깔 변경
      getRowStyle(params){
        if(params.data.prod_result_cd == this.selectedTarget.prod_result_cd){
          return {backgroundColor: '#d6d6d6'}
        }
      },

      // 검사항목별 측정값 입력 혹은 상세정보 표시
      openDtl(testMetd, idx){
        if(testMetd == '샘플링'){
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

      // ------------ 모달 메소드 ------------
      modalToggle(){
        this.isModal = !this.isModal;
        this.getModalList();
      },

      async getModalList(){
        // 조회대상(radio) 미선택 시 => 전체 조회
        // 조회대상(radio) 선택 시 => 선택한 대상 내에서 카테고리 조건 넣어 조회
        // ** 이름을 입력하면 유사한(LIKE) 이름으로 조회
        let params = { 
          type: this.selected_radio,
          cate_type: this.selected_div,
          cate: this.selected_cate,
          nm: this.modal_val.nm 
        };

        let result = await axios.get('/api/quality/targetAll', {params: params}).catch(err => console.log(err));
        let data = result.data;
        data.forEach((obj) => {
          obj.has_std = obj.std_date == null ? '미등록' : '등록완료'; // SELECT문 컬럼에 포함되지 않았으므로 추가
        });
        this.modalData = data;
      },
      
      modalSelect(params){
        let selected = params.data;
        if(!this.selected_radio){ // 이름으로 검색만 하고 radio 선택 안 되어있으면 선택해줌
          let type = null;
          switch(selected.type){
            case '자재' : type = 'P01'; break;
            case '공정' : type = 'P02'; break;
            case '제품' : type = 'P03'; break;
          }
          this.selected_radio = type;
          this.changeDivs('modal');
        }
        this.selected_div = selected.cate_type_cd;
        this.selected_cate = selected.category_cd;
        console.log(selected.cate_type_cd + selected.category_cd);

        this.date_val = selected.std_date ? this.$comm.getMyDay(selected.std_date) : this.$comm.getMyDay();
        this.modal_val.cd = selected.cd;
        this.modal_val.nm = selected.nm;
        this.myData_save = new Set(); // 다른 대상에 똑같은 내용을 삽입할 수 있도록 하기 위함 (저장 비교조건 통과)
        this.modalToggle();
      },
      // ---------- 모달 메소드 끝 -----------

      async stdInsert(){
        let isChanged = false; // getTList()에서 임시저장했던 기존 내용이 변경되었는지 확인할 변수
        let originSize = this.myData_save.size; // 원래 데이터 길이
        let insertSize = this.myData.length; // 새로 적용할 길이
        let targetCd = this.modal_val.cd;
        
        if(!targetCd) { // 대상코드 없으면 실행 불가
          this.$swal(
            '대상 미선택',
            '대상을 정확히 선택해주세요.',
            'warning'
          );
          return;
        } else if(insertSize == 0){
          this.$swal(
            '항목 미선택',
            '최소 1개 이상의 항목이 선택되어야 합니다.',
            'warning'
          );
          return;
        } else if(this.myData.length != originSize){
          isChanged = true;  // 길이가 달라졌으면 한 개라도 변한 것으로 인식하고 진행
        } 
        
        let insertArr = [];
        let originCnt = 0;
        
        this.myData.forEach((changed) => { // 일반 배열이 아닌 proxy 타입이라 forEach로만 접근 가능
          // 길이가 달라지지 않았다면, 저장된 데이터와 똑같은 개수를 체크
          if(!isChanged & this.myData_save.has(changed.test_cd)) originCnt++;

          insertArr.push({target_type: changed.target_type, 
                          target_cd: targetCd,
                          test_cd: changed.test_cd});
        });
        
        // 길이가 달라졌거나, 저장된 데이터와 내용이 하나라도 달라졌으면 실행 가능
        if(originCnt != originSize) isChanged = true;

        // 변경사항이 없다면 알림 띄우고 종료
        if(!isChanged){ 
          this.$swal(
            '변경사항 없음',
            '변경된 항목이 없습니다.',
            'warning'
          );
          return;
        }

        // 최종적으로 변경사항이 있는 경우에만 실행
        let result = await axios.post('/api/quality/std', insertArr)
                                .catch(err => console.log(err));

        if(result.data == 'success'){
          this.$swal(
            '등록완료',
            '품질기준이 등록되었습니다.',
            'success'
          );
          this.saveData(this.myData);
        } else {
          this.$swal(
            '오류발생',
            '품질기준을 등록하지 못했습니다.',
            'error'
          );
        }
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