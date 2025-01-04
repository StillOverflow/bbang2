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
            <button class="btn btn-warning" @click="getList">조회</button>
            <button class="btn btn-secondary ms-3" @click="searchReset">초기화</button>
          </div>
        </div>
      </div>
      
      <!-- 목록 -->
      <div class="card-body">
        <div class="row">
          <div class="col-8">
            <button class="btn btn-outline-secondary btn-sm me-3 mb-2" @click="selectUpdate('expose')">선택 노출</button>
            <button class="btn btn-outline-secondary btn-sm mb-2" @click="selectUpdate()">선택 미노출</button>
          </div>
          <div class="col-4 text-end">
            <button class="btn btn-primary mb-2" @click="insertTestOpen">신규 등록</button>
          </div>
        </div>
        <ag-grid-vue class="ag-theme-alpine" style="height: 605px" :columnDefs="defs" :rowData="rowData" 
          @grid-ready="gridFit" @rowClicked="rowClicked" :gridOptions="gridOptions"/>
      </div>
    </div>

    <!-- 검사항목 모달 -->
    <ModalLayout :modalCheck="isModal" style="z-index: 1000;">
        <template v-slot:header>
        <h5>검사항목 상세</h5>
        <button type="button" aria-label="Close" class="close" @click="modalToggle">×</button>
        </template>
        <template v-slot:default>

          <div class="row g-2">
            <h6 class="col-4 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">검사항목코드</h6>
            <div class="col-6 mb-2">
              <input type="text" class="form-control" v-model="selected.test_cd" disabled>
            </div>
            <h6 class="col-4 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">검사명</h6>
            <div class="col-6 mb-2">
              <input type="text" class="form-control" v-model="selected.test_nm" :disabled="selected.isUsed">
            </div>
            <h6 class="col-4 mb-2 d-flex align-items-start justify-content-center" :style="t_overflow">검사내용</h6>
            <div class="col-6 mb-2">
              <textarea class="form-control" rows="5" v-model="selected.test_dtl"></textarea>
            </div>

            <h6 class="col-4 mb-2 d-flex justify-content-center align-items-center" :style="t_overflow">검사방식</h6>
            <div class="form-check col-8 d-flex align-items-center">
              <div v-for="(opt, idx) in testMetds" :key="idx">
                <input class="form-check-input ms-1" type="radio" v-model="selected.test_metd" :value="opt.comm_dtl_cd" :id="'r_metd' + opt.comm_dtl_cd" :disabled="selected.isUsed" @change="nullPassValue">
                <label class="form-check-label ms-1 me-3 text-start" :for="'r_metd' + opt.comm_dtl_cd">
                  {{opt.comm_dtl_nm}}
                </label>
              </div>
            </div>

            <h6 class="col-4 mb-2 d-flex justify-content-center align-items-center" :style="t_overflow">적용대상</h6>
            <div class="form-check col-8 d-flex align-items-center">
              <div v-for="(opt, idx) in targetTypes" :key="idx" v-show="isInserted"> <!-- 이미 등록된 화면에서 보여줄 때는 라디오타입 -->
                <input class="form-check-input ms-1" type="radio" v-model="selected.target_type" :value="opt.comm_dtl_cd" :id="'r_target' + opt.comm_dtl_cd" :disabled="selected.isUsed">
                <label class="form-check-label ms-1 me-3 text-start" :for="'r_target' + opt.comm_dtl_cd">
                  {{opt.comm_dtl_nm}}
                </label>
              </div>
              <div v-for="(opt, idx) in targetTypes" :key="idx" v-show="!isInserted"> <!-- 신규 등록화면에서 보여줄 때는 다중선택 가능 (선택한 만큼 다중행 insert됨) -->
                <input class="form-check-input ms-1" type="checkbox" v-model="selected.target_type" :value="opt.comm_dtl_cd" :id="'c_target' + opt.comm_dtl_cd">
                <label class="form-check-label ms-1 me-3 text-start" :for="'c_target' + opt.comm_dtl_cd">
                  {{opt.comm_dtl_nm}}
                </label>
              </div>
            </div>

            <!-- 샘플링검사일 때만 있는 값 -->
            <h6 class="col-4 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">합격최소값</h6>
            <div class="col-2 mb-2">
              <input type="text" class="form-control" v-model="selected.pass_min" :disabled="selected.isUsed || selected.test_metd == 'O02'" @change="checkNumberAlert('min')">
            </div>
            <h6 class="col-2 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">~ 최대값</h6>
            <div class="col-2 mb-2">
              <input type="text" class="form-control" v-model="selected.pass_max" :disabled="selected.isUsed || selected.test_metd == 'O02'" @change="checkNumberAlert('max')">
            </div>

            <h6 class="col-4 mb-2 d-flex justify-content-center align-items-center" :style="t_overflow">퍼센트(%)</h6>
            <div class="form-check col-8 d-flex">
              <input class="form-check-input ms-1" type="radio" v-model="selected.pass_ispercent" :value="'A01'" :id="'r_isPercentY'" :disabled="selected.isUsed || selected.test_metd == 'O02'">
              <label class="form-check-label ms-2 me-4 text-start" :for="'r_isPercentY'">Y</label>
              <input class="form-check-input ms-2" type="radio" v-model="selected.pass_ispercent" :value="null" :id="'r_isPercentN'" :disabled="selected.isUsed || selected.test_metd == 'O02'">
              <label class="form-check-label ms-2 me-3 text-start" :for="'r_isPercentN'">N</label>
            </div>

            <h6 class="col-4 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">등록일자</h6>
            <div class="col-6 mb-2">
              <input type="text" class="form-control" v-model="selected.create_dt" disabled>
            </div>
          </div>

        </template>
        <template v-slot:footer>
          <button type="button" class="btn btn-primary" @click="insertTest" v-show="!isInserted">등록</button>
          <button type="button" class="btn btn-success" @click="updateTest" v-show="isInserted">수정</button>
          <button type="button" class="btn btn-danger" @click="deleteTest" v-show="!selected.isUsed && isInserted">삭제</button>
          <button type="button" class="btn btn-secondary" @click="modalToggle">닫기</button>
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
        selected: {},
        selectedSave: {}, // 수정 시 변경사항 확인용
        isInserted: null, // 신규등록 아닐 때 true

        // 일반 grid API 데이터
        defs: [
          { headerName: '코드', field: 'test_cd', maxWidth: 80 },
          { headerName: '검사명', field: 'test_nm', maxWidth: 140 },
          { headerName: '검사방식', field: 'test_metd_nm', maxWidth: 100 },
          { headerName: '적용대상', field: 'target_type_nm', maxWidth: 100 },
          { headerName: '검사내용', field: 'test_dtl' },
          { headerName: '사용', field: 'status_nm', maxWidth: 70 },
          { headerName: '노출', field: 'use_status_nm', maxWidth: 70 },
          { headerName: '등록일', field: 'create_dt', valueFormatter: this.$comm.dateFormatter, width: 80 },
          { headerName: '수정일', field: 'update_dt', valueFormatter: this.$comm.dateFormatter_returnNull, width: 80 },
        ],
        rowData: [],
        gridApi: null,
        colApi: null,

        gridOptions: {
          defaultColDef: {
            cellClass: 'text-overflow'
          },
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
        this.selected = {...data};
        this.selected.create_dt = this.$comm.getMyDay(data.create_dt);
        this.selected.isUsed = data.status_nm == 'Y';

        this.isInserted = true;
        this.selectedSave = {...this.selected}; // 수정 시 변경사항 확인용으로 저장 (완전 복사하지 않고 얕은 복사-원본 보호)
        this.modalToggle();
      },

      // ------------ 모달 메소드 ------------
      modalToggle(){
        this.isModal = !this.isModal;
      },
      // ---------- 모달 메소드 끝 -----------

      // 검사항목 삭제 (사용되지 않은 것만 삭제 가능)
      async deleteTest(){
        let result = await axios.delete('/api/quality/test/all/' + this.selected.test_cd)
                                .catch(err => console.log(err));
        if(result.data == 'success'){
          this.$swal(
            '삭제완료',
            '검사항목이 삭제되었습니다.',
            'success'
          );
          let newArr = [...this.rowData]; // 새로운 배열 선언
          for(let i = 0; i < newArr.length; i++){
            if(newArr[i].test_cd == this.selected.test_cd) newArr.splice(i, 1); // 배열 인덱스에서 1개만 삭제
          }
          this.rowData = newArr; // 변경된 배열로 반영
          this.modalToggle();
        } else {
          this.$swal(
            '오류발생',
            '검사항목을 삭제하지 못했습니다.',
            'error'
          );
        }
      },

      // 검사항목 수정 (사용되지 않은 것들은 전체 수정 가능하고, 사용된 것들은 검사내용만 수정 가능함.)
      async updateTest(){
        let keys = Object.keys(this.selected);
        let save = this.selectedSave;
        keys.forEach((key) => {
          if(this.selected[key] == save[key]) delete save[key]; // 변경사항이 없는 경우 저장할 값에서 해당 키-값 삭제
          else save[key] = this.selected[key]; // 변경사항이 있는 경우 저장할 값에 수정사항 반영
        });
        
        if(Object.keys(save).length == 0){ // 변경사항이 하나도 없으면 종료
          this.$swal(
            '변경사항 없음',
            '변경된 사항이 없습니다.',
            'warning'
          );
          this.selectedSave = {...this.selected}; // 다시 비교할 수 있게 원래대로 복구
          return;
        }

        save.update_dt = this.$comm.getMyDay(); // 수정일자 오늘로 입력
        let result = await axios.put('/api/quality/test/all/' + this.selected.test_cd, save)
                                .catch(err => console.log(err));
        if(result.data == 'success'){
          this.$swal(
            '수정완료',
            '검사항목 정보가 수정되었습니다.',
            'success'
          );
          let newArr = [...this.rowData]; // 새로운 배열 선언
          newArr.forEach((row, idx) => { // 수정사항 반영
            if(row.test_cd == this.selected.test_cd){
              let newObj = this.changeObj(this.selected, this.selected)
              newArr[idx] = newObj;
            }
          });
          this.rowData = newArr; // 변경된 배열로 반영
          this.modalToggle();
        } else {
          this.$swal(
            '오류발생',
            '검사항목 정보를 수정하지 못했습니다.',
            'error'
          );
        }
      },

      // 목록에서 선택한 항목들 일괄 노출/미노출
      async selectUpdate(val){
        let arr = this.gridApi.getSelectedNodes();
        let arrLen = arr.length;
        if(arrLen == 0) return; // 선택한 항목이 없다면 중단

        let useStatus = null;
        if(val == 'expose') useStatus = 'A01'; // 노출 버튼 클릭 시
        else useStatus = 'A02'; // 미노출 버튼 클릭 시

        let values = [];
        for(let row of arr){ // ** forEach는 await과 맞지 않음.
          values.push({
            changeObj: {use_status: useStatus, update_dt: this.$comm.getMyDay()}, // 수정일자 오늘로 입력
            test_cd: row.data.test_cd
          });
        };

        let result = await axios.put('/api/quality/test/all/', values)
                                .catch(err => console.log(err));
        if(result.data == 'success'){
          this.$swal(
            '수정완료',
            `선택한 검사항목들이 ${val == 'expose' ? '노출' : '미노출'} 상태로 변경되었습니다.`,
            'success'
          );

          let newArr = [...this.rowData]; // 후처리 - 새로운 배열 선언
          newArr.forEach((row, idx) => { // 수정사항 반영
            values.forEach((change) => {
              if(row.test_cd == change.test_cd){
                newArr[idx] = this.changeObj(row, change.changeObj);
              }
            });
          });
          this.rowData = newArr; // 변경된 배열로 반영

        } else {
          this.$swal(
            '오류발생',
            `선택한 검사항목들을 변경하지 못했습니다.`,
            'error'
          );
        }
      },

      // 목록에 수정사항 반영하기 위한 객체 변경 메소드
      changeObj(change, compare){
        // 공통코드 이름 적용하기
        this.testMetds.forEach((metd) => {
          if(metd.comm_dtl_cd == compare.test_metd) change.test_metd_nm = metd.comm_dtl_nm;
        });
        this.targetTypes.forEach((type) => {
          if(type.comm_dtl_cd == compare.target_type) change.target_type_nm = type.comm_dtl_nm;
        });

        if(compare.use_status){
          let statusNm = compare.use_status == 'A01' ? 'Y' : 'N';
          change.use_status_nm = statusNm;
        }
        if(change != compare )change.update_dt = this.$comm.getMyDay(); // 수정일자 오늘로 반영
        
        return change;
      },

      // 전수검사를 선택했을 때 합격값 모두 null 변경
      nullPassValue(){
        if(this.selected.test_metd == 'O02'){
          this.selected.pass_max = null;
          this.selected.pass_min = null;
          this.selected.pass_ispercent = null;
        }
      },
      
      // 신규등록 버튼 클릭 시 검사항목 등록 모달 오픈
      insertTestOpen(){
        this.selected = {target_type: [], create_dt: this.$comm.getMyDay()};
        this.isInserted = false;
        this.modalToggle();
      },

      // 검사항목 신규등록
      async insertTest(){
        let insertObj = this.selected;

        // 입력값 유효성 검사
        if(!insertObj.test_nm){
          this.$swal(
            '검사명 미입력',
            '검사명이 입력되지 않았습니다.',
            'warning'
          );
          return;
        } else if (!insertObj.test_metd){
          this.$swal(
            '검사방식 미선택',
            '검사방식이 선택되지 않았습니다.',
            'warning'
          );
          return;
        } else if (insertObj.target_type.length == 0){
          this.$swal(
            '적용대상 미선택',
            '적용대상은 최소 1가지 이상 선택되어야 합니다.',
            'warning'
          );
          return;
        }

        let result = await axios.post('/api/quality/test', insertObj)
                                .catch(err => console.log(err));
        if(result){
          this.$swal(
            '등록완료',
            `검사항목이 등록되었습니다.`,
            'success'
          );
          let newArr = [...result.data, ...this.rowData]; // 입력된 행을 결과로 받아 펼침연산자로 합침
          this.rowData = newArr;
          this.modalToggle();
        } else {
          this.$swal(
            '오류발생',
            '검사항목을 등록하지 못했습니다.',
            'error'
          );
        }
      },

      // input text에서 숫자 유효성 확인용
      checkNumberAlert(target){
        let val = null;
        if(target == 'max') val = !this.selected.pass_max ? 0 : this.selected.pass_max; // 입력값 null이면 0으로 취급
        else val = !this.selected.pass_min ? 0 : this.selected.pass_min;

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
        // 최대/최소값 어긋나는 경우
        if(target == 'max' && val < this.selected.pass_min) val = this.selected.pass_min;
        else if(target == 'min' && val > this.selected.pass_max) val = this.selected.pass_max;

        if(target == 'max') this.selected.pass_max = Number(val);
        else this.selected.pass_min = Number(val);
      }
      
    }
  };
</script>

<style>
  .text-overflow {
    white-space: nowrap;
    overflow: hidden;
  }
</style>