<template>
    <div>
        <div class="row mb-1 d-flex justify-content-between">

          <div class="col-12 col-md-6 col-xl-3 row text-end p-xl-0">
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">{{ isMatTest ? '발주' : '생산' }}번호</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.refer_cd" disabled>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow">{{ isMatTest ? '자재' : '제품' }}코드</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.target_cd" disabled>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 col-xl-4 mb-2" :style="t_overflow">{{ isMatTest ? '자재' : '제품' }}명</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control" :value="selectedTarget.target_nm" disabled>
            </div>

            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow" v-show="!isMatTest">공정코드</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2" v-show="!isMatTest">
              <input type="text" class="form-control" :value="selectedTarget.proc_cd" disabled>
            </div>
            <h6 class="col-2 col-md-3 col-xl-4 mb-2" :style="t_overflow" v-show="!isMatTest">공정명</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2" v-show="!isMatTest">
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
            <h6 class="col-2 col-md-3 col-xl-4 mb-2 pe-3" :style="t_overflow">{{ isMatTest ? '입고' : '생산' }}량</h6>
            <div class="col-10 col-md-9 col-xl-8 mb-2">
              <input type="text" class="form-control text-end" v-model="total_qty" @change="checkNumberAlert('total')" :disabled="!isWaitList || !isMatTest">
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
            <button class="btn btn-primary" :style="t_overflow" @click="recInsert" v-show="isWaitList">SUBMIT</button>
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
  import ModalLayout from "../../views/components/modalLayout.vue";

  export default {
    name: 'QualityTestBox',
    props: {
        isWaitList: Boolean, // true: 검사대기 탭, false: 검사완료 탭 (읽기전용)
        isMatTest: Boolean, // true: 자재검사, false: 공정/완제품검사
        selectedTarget: Object
    },
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},

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

        gridOptions: {
          pagination: true,
          paginationAutoPageSize: true,
          overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
          suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        },

        // 검사결과 입력에 필요한 데이터
        // selectedTarget: {}, // 목록에서 선택한 대상. 컴포넌트 분리를 위해 props로 뺌.

        samplingTests: [], // 선택한 대상의 검사항목 중 샘플링검사 유형
        fullTests: [], // 선택한 대상의 검사항목 중 전수검사 유형
        members: [], // 품질부서의 사원들
        
        total_qty: 0,
        test_qty: null,
        def_qty: 0,
        test_dt: null,
        id: null, // 선택된 담당자 사원번호
        note: null,
      }
    },

    computed: { // this.로 참조하려면 data 생성 후 computed에서 계산되어야 함.
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
        return this.total_qty - this.def_qty;
      }
    },

    components: { 
        AgGridVue, // grid API
        ModalLayout
    },

    created(){ 
      this.getMembers();
    },
    
    methods: {
      // 품질부서 사원목록 불러오기
      async getMembers(){
        this.members = await this.$comm.getMembers('DPT2');
      },

      // 목록에서 타겟 선택 시, 검사결과란 불러오기 전 모든 값 초기화
      reset(clicked){
        if(clicked.id){ // 검사완료목록에서는 값을 가지고 있음.
          this.total_qty = clicked.total_qty;
          this.test_qty = clicked.test_qty;
          this.pass_qty = clicked.pass_qty;

          if(clicked.def_qty) this.isDefect = true; // 처리해야 할 불량이 있다면 true
          else this.isDefect = false;
          if(clicked.complete_dt) this.isDefCompleted = true; // 불량이 이미 처리되었다면 true
          else this.isDefCompleted = false;

          this.def_qty = clicked.def_qty;
          this.def_cd = clicked.def_cd;
          this.def_nm = clicked.def_nm;
          this.id = clicked.id;
          this.note = clicked.note;
          this.test_dt = this.$comm.getDatetimeMin(clicked.test_dt);
        } else { // 검사대기목록은 값이 없음.
          this.total_qty = 0;
          this.test_qty = null;
          this.pass_qty = null;
          this.def_qty = 0;
          this.def_cd = null;
          this.def_nm = null;
          this.note = null;
          this.test_dt = null;
        }
      },

      // 목록에서 타겟 선택 시 검사결과란에 정보 불러오기
      async loadTarget(clicked){
        // 초기화
        await this.reset(clicked);
        this.samplingTests = [];
        this.fullTests = [];

        if(!this.isMatTest){ // 자재는 전체수량을 직접 입력해야 하지만, 공정/제품검사는 자동 입력됨.
          this.total_qty = clicked.total_qty;
        }

        // 검사항목 불러오기
        if(clicked.is_last == 1 || clicked.target_type == 'P03'){ // 마지막 공정일 경우 공정별+완제품 검사를 동시에 해야 함.
          this.getTests(clicked, 'P03');
          this.getTests(clicked, 'P02');
        } else if(clicked.is_last == 0 || clicked.target_type == 'P02'){ // 공정별 검사일 때
          this.getTests(clicked, 'P02');
        } else { // 자재 검사일 때 (is_last 컬럼이 없음)
          this.getTests(clicked, 'P01');
        }

        // 검사완료목록일 경우 상세 측정결과값 가져오기
        if(!this.isWaitList){
          let result = await axios.get('/api/quality/rec/dtl', {params: {test_rec_cd: clicked.test_rec_cd}})
                                  .catch(err => console.log(err));
          let data = result.data;
          if(data){ // 값이 있다면 샘플링테스트 측정값에 넣기
            this.samplingTests.forEach((test) => {
              data.forEach((testData) => {
                if(test.test_cd == testData.test_cd) test.test_value = testData.test_value;
              })
            });
          }
        }
      },
      
      // 검사할 항목들을 얻어 검사방식에 따라 샘플림검사/전수검사 분리하기
      async getTests(target, type){
        let query = null;
        
        if(type == 'P02'){  
          query = {cd: target.proc_cd, type: type}; // P02: 공정대상 검사항목
        } else {
          query = {cd: target.target_cd, type: type}; // P01(자재대상), P03(완제품대상) 검사항목
        }

        let testLists = await axios.get('/api/quality/test/my', {params: query}) // 해당 품질기준의 검사항목 불러옴
                                    .catch(err => console.log(err));
       
        testLists.data.forEach((test) => {
          test.isPass = null; // 적합/부적합 판단용
        
          if(test.test_metd == 'O01'){ 
            this.samplingTests.push(test); // O01: 샘플링검사일 경우
            if(this.isWaitList && !this.isMatTest){ // 공정/제품 검사대기목록에서의 샘플량 기본값 자동 입력
                let testQty = target.total_qty * 0.01;
                this.test_qty = testQty < 5 ? 5 : testQty; // 샘플량을 전체에서 1%로 자동 입력하되, 적어도 5개는 되어야 함.
            }
          } else { 
            this.fullTests.push(test); // O02: 전수검사인 경우
          }
        });
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
              this.def_qty = this.total_qty;
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
        else if(target == 'total') val = this.total_qty;

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
        if(target != 'total' && val > this.total_qty){ // (제품)입력값이 생산량보다 많다면 최대값 적용
          val = this.total_qty;
        } else if(target == 'total' && val > Number(this.selectedTarget.yet_qty)){ // (자재)입력값이 미입고량보다 많다면 최대값 적용
          val = this.selectedTarget.yet_qty;
        }

        if(target == 'def') this.def_qty = Number(val);
        else if(target == 'test') this.test_qty = val < 5 ? 5 : Number(val); // 샘플량은 최소 5개 이상이어야 함.
        else if(target == 'total') this.total_qty = Number(val);
      },

      // ------------ 불량 선택 모달 메소드 ------------
      modalToggle(){
        this.isModal = !this.isModal;
        this.getModalList();
      },

      async getModalList(){ // 불량목록 불러오기
        let params = {
          type: this.isMatTest ? 'P01' : 'P02', // 불량유형: 자재 or 공정중
          subType: this.selectedTarget.is_last == 1 ? 'P03' : null // 제품의 마지막 공정일 시 불량유형: 제품도 함께 조회
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
        let isLast = target.is_last == 1;

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
          target_cd: target.target_cd, 
          proc_cd: target.proc_cd,
          total_qty: this.total_qty, 
          test_qty: this.test_qty, 
          pass_qty: this.pass_qty, 
          def_qty: this.def_qty,
          id: this.id, 
          def_cd: this.def_qty > 0 ? this.def_cd : null, // def_cd가 있더라도 불량양이 없으면 null 입력
          note: this.note
        };
        
        if(this.isMatTest){
          headerObj.target_type = 'P01';
        } else {
          headerObj.target_type = isLast ? 'P03' : 'P02'; // 제품 마지막 공정에서의 검사는 P03(완제품검사)으로 입력 
        }

        let result = await axios.post('/api/quality/rec', {header: headerObj, dtl: dtlArr})
                                .catch(err => console.log(err));

        if(result.data == 'success'){
          this.$swal(
            '등록완료',
            '검사결과가 등록되었습니다.',
            'success'
          );
          await this.$emit('afterInsert', target); // 후처리 부모메소드
        } else {
          this.$swal(
            '오류발생',
            '검사결과를 등록하지 못했습니다.',
            'error'
          );
        }
      }

    }
  };
</script>