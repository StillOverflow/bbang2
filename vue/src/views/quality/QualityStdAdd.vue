품질
<template>
  <div class="py-4 container-fluid">
    <div class="card">
  
      <div class="card-header bg-light ps-5 ps-md-4">
        <!-- 대상분류 자재/제품/공정 -->
        <div class="row mb-3">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex justify-content-center" :style="t_overflow">조회대상</h6>
          <div class="form-check col-10 d-flex">
            <div v-for="(opt, idx) in radios" :key="idx">
              <input class="form-check-input ms-1" type="radio" v-model="selected_radio" :value="opt.item" :id="'radio' + opt.item"
                @change="getDivs">
              <label class="form-check-label ms-2 me-4 text-start" :for="'radio' + opt.item">
                {{opt.name}}
              </label>
            </div>
          </div>
        </div>
    
        <!-- 구분/카테고리/모달 조회조건 선택 -->
        <div class="row">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상구분</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="selected_div" :disabled="noCate">
              <option :value="null" disabled hidden>선택</option>
              <option v-for="(opt, idx) in divs" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">카테고리</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="selected_cate" :disabled="noCate">
              <option :value="null" disabled hidden>선택</option>
              <option v-for="(opt, idx) in cates" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상선택</h6>
          <div class="col-10 col-lg-4 col-xxl-2 d-flex">
            <div class="input-group">
              <input type="text" class="form-control" v-model="modal_val.nm" style="height: 41px;">
              <button class="btn btn-warning" type="button" @click="modalToggle">SEARCH</button>
            </div>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상코드</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="text" class="form-control" :value="modal_val.cd" readonly>
          </div>
        </div>
  
      </div>
  
      <!-- 검사항목 추가/삭제 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7 col-xl-6">
            <h4 class="ms-3">적용 가능 항목</h4>
          </div>
          <div class="col-5 col-xl-6">
            <div class="row">
              <div class="col-12 col-md-7 col-xl-9">
                <h4 class="ms-3" :style="t_overflow">선택된 항목</h4>
              </div>
              <div class="col-12 col-md-5 col-xl-3 text-center">
                <button class="btn btn-warning" :style="t_break" @click="getTList">불러오기</button>
              </div>
            </div>
          </div>
        </div>
  
        <div class="row mb-4">
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine w-100" :style="g_height" :columnDefs="defs" :rowData="yetData" 
             @grid-ready="yetGrid" :gridOptions="gridOptions"/>
          </div>
          <div class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center">
            <button class="btn btn-outline-primary" :style="t_overflow" @click="getSelected('추가')">
              <i class="fa-solid fa-plus" style="color: #0951ce;"></i>
            </button>
            <button class="btn btn-outline-danger" :style="t_overflow" @click="getSelected()">
              <i class="fa-solid fa-minus" style="color: #fa0000;"></i>
            </button>
          </div>
          <div class="col-5 col-xl-6">
            <ag-grid-vue class="ag-theme-alpine w-100"  :style="g_height" :columnDefs="defs" :rowData="myData" 
             @grid-ready="myGrid" :gridOptions="gridOptions"/>
          </div>
        </div>
  
        <div class="row d-flex justify-content-end">
          <h6 class="col-2 col-md-1 text-center" :style="t_overflow">
            등록일
          </h6>
          <div class="col-5 col-md-3 col-xxl-2">
            <input type="text" class="form-control" :value="date_val" readonly>
          </div>
          <div class="col-5 col-md-4 col-xxl-3 text-center">
            <button class="btn btn-primary me-3" :style="t_overflow" @click="stdInsert">SUBMIT</button>
            <!-- <button class="btn btn-success me-3" :style="t_overflow" @click="stdInsert">SAVE</button> -->
            <button class="btn btn-secondary" :style="t_overflow" @click="getTList">RESET</button>
          </div>
        </div>
      </div>
    </div>

    <ModalLayout :modalCheck="isModal">
        <template v-slot:header>
          <h5>품질기준 대상선택</h5>
          <button type="button" aria-label="Close" class="close" @click="modalToggle">×</button>
        </template>
        <template v-slot:default>
          <ag-grid-vue class="ag-theme-alpine" :style="g_height" :columnDefs="modalDefs" :rowData="modalData" 
            :gridOptions="gridOptions" :rowSelection="false" @rowClicked="null" @grid-ready="gridFit"/>
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
    name: 'QualityStdAdd',
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},
        g_height: {height: '520px'},
        
        // 검색조건 전용 값
        selected_radio: null,
        radios: [],
        selected_div: null,
        divs: [],
        noCate: false, // 공정은 카테고리가 없으므로 비활성화용
        selected_cate: null,
        cates: [],
        date_val: '',

        // 모달 내부 grid API 데이터 (Defs: thead 구성, Data: tbody 구성)
        isModal: false, // 토글기능
        modalDefs: [
          { headerName: '유형', field: 'type', width: 70 },
          { headerName: '구분', field: 'cate_type', width: 80 },
          { headerName: '카테고리', field: 'category', width: 80 },
          { headerName: '코드', field: 'cd', width: 80 },
          { headerName: '이름', field: 'nm', width: 136 },
          { headerName: '등록현황', 
            field: 'has_std', 
            cellClassRules: {
              'textRed': params => params.value == '미등록',
              'textGreen': params => params.value == '등록완료'
            },
            width: 100 },
          { headerName: '등록일', field: 'std_date', width: 120, valueFormatter: this.$comm.dateFormatter_returnNull}
        ],
        modalData: [],
        modal_val: { // 선택된 값
          nm: null,
          cd: null
        },

        // 일반 grid API 데이터
        defs: [
          { headerName: '검사명', field: 'test_nm' },
          { headerName: '검사방식', field: 'test_metd' },
          { headerName: '검사내용', field: 'test_dtl' }
        ],

        myData: [],
        myApi: null,
        myColApi: null,

        yetData: [],
        yetApi: null,
        yetColApi: null,

        gridOptions: {
          pagination: true,
          paginationAutoPageSize: true,
          overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
          suppressMovableColumns: true, // 컬럼 드래그 이동 방지
          rowSelection: { 
            mode: 'multiRow'
          }
        }
      }
    },

    components: { 
        AgGridVue, // grid API
        ModalLayout
    },

    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '품질기준 등록'});

      // 조회대상 불러오기
      this.getCondition('QT', 'radio');
    },

    methods: {
      gridFit(params){ // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
        params.api.sizeColumnsToFit();
      },

      yetGrid(params){ // '적용가능목록' @grid-ready 시 매개변수 속성으로 자동 접근
        params.api.sizeColumnsToFit();
        this.yetApi = params.api;
        this.yetColApi = params.columnApi;
      },

      myGrid(params){ // '선택목록' @grid-ready 시 매개변수 속성으로 자동 접근
        params.api.sizeColumnsToFit();
        this.myApi = params.api;
        this.myColApi = params.columnApi;
      },
      
      // 공통코드 기반으로 검색조건 표시하기
      async getCondition(cd, type){ 
        let types = [this.radios, this.divs, this.cates]; // 검색조건으로 들어갈 각각의 input을 배열로 임시저장
        let typesNo = null;
        let arr = await this.$comm.getComm(cd); // 공통코드 axios.get

        switch(type){
          case 'radio' : typesNo = 0; break;
          case 'divs' : typesNo = 1; break;
          case 'cate' : typesNo = 2; break;
        };
        
        types[typesNo].length = 0; // 실행할 때마다 값이 중복되지 않게 비우고 push
        for(let i = 0; i < arr.length; i++){
          types[typesNo].push({
            item : arr[i].comm_dtl_cd, // 공통코드
            name : arr[i].comm_dtl_nm // 표시할 한글명
          });
        };
      },

      async getDivs(){
        // 대상구분 변경될 때, 다시 null부터 시작
        this.selected_div = null;
        this.selected_cate = null;

        // 구분 및 카테고리 재호출
        switch(this.selected_radio){
          case 'P01' : // 자재 선택한 경우
            this.getCondition('MA', 'divs');
            this.getCondition('MC', 'cate'); 
            this.noCate = false; 
            break;
          case 'P02' : { // 공정중 선택한 경우 => 공통코드가 없으므로 따로 실행해야 함.
            // ** switch - case 조건 안에서 변수 선언 시, 작업 내용을 중괄호로 묶지 않으면 오류남.
            let result = await axios.get('/api/standard/procCd').catch(err => console.log(err));
            result.data.forEach((obj) => {
              this.divs.push({
                item: obj.proc_cd,
                name: obj.proc_nm
              });
            });
            this.modal_val = result.data[0].proc_cd;
            this.noCate = true; // 구분 선택이 아예 없음.
            break;
            };
          case 'P03' : // 제품 선택한 경우
            this.getCondition('PD', 'divs');
            this.getCondition('PC', 'cate'); 
            this.noCate = false; 
            break;
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
          cate: this.selected_cate,
          nm: this.modal_val.nm 
        };

        let result = await axios.get('/api/quality/targetAll', {params: params});
        let data = result.data;
        data.forEach((obj) => {
          obj.has_std = obj.std_date == null ? '미등록' : '등록완료';
        });
        this.modalData = data;
      },
      // ---------- 모달 메소드 끝 -----------

      // 검사항목 버튼 클릭 시 불러오기
      async getTList(){
        const axiosGet = async (val) => { // 'yet' or 'my'에 따라 같은 동작 실행
          let query = {cd: 'PR01', type : this.selected_radio};

          let result = await axios.get('/api/quality/test/' + val, {params: query})
                                .catch(err => console.log(err));
          let data = result.data;

          // 각각의 grid 데이터에 넣기
          if(val == 'yet') this.yetData = data;
          else this.myData = data;
        };

        // if modalVal 있는 경우 실행해야 함. (구현전)
        await axiosGet('yet');
        await axiosGet('my');
      },

      getSelected(type){ // 추가/삭제버튼 동작
        let selected = null;
        if(type == '추가') selected = this.yetApi.getSelectedNodes(); // 추가버튼일 시
        else selected = this.myApi.getSelectedNodes(); // 삭제버튼일 시

        if(selected.length != 0){ // 선택된 값이 있을 경우에만 실행
          // grid는 참조형식이라 개별값을 직접 조작할 수 없으므로 가상의 배열 선언
          let addArr = [];
          let changeArr = null;
          if(type == '추가') changeArr = this.yetData;
          else changeArr = this.myData;
          
          selected.forEach((val) => { // 선택된 값을 순회, 비교하며 배열에서 추가/삭제 실행
            addArr.push(val.data);
            changeArr = changeArr.filter(obj => obj.test_nm != val.data.test_nm); // 선택되지 않은 것만 남김
          });
          
          // 수정된 배열로 반영하기
          if(type == '추가'){
            this.yetData = changeArr;
            this.myData = [...this.myData, ...addArr]; // 펼침연산자로 기존의 값에 추가함
          } else {
            this.myData = changeArr;
            this.yetData = [...this.yetData, ...addArr];
          }
        }
      },

      async stdInsert(){
        let insertArr = [];
        
        this.myData.forEach((obj) => {
          insertArr.push({target_type: obj.target_type, 
                          target_cd: 'PR01',
                          test_cd: obj.test_cd});
        });
        console.log(insertArr);

        let result = await axios.post('/api/quality/std', insertArr)
                                .catch(err => console.log(err));

        if(result.data == 'success'){
          this.$swal(
            '등록완료',
            '품질기준이 등록되었습니다.',
            'success'
          );
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