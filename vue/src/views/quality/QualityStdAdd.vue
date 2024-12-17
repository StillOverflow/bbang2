품질
<template>
  <div class="py-4 container-fluid">
    <div class="card">
  
      <div class="card-header bg-light ps-5 ps-md-4">
        <!-- 대상분류 자재/제품/공정 -->
        <div class="row mb-3">
          <div class="col-12 col-md-1 text-center me-5 mb-2 fw-bolder" :style="t_overflow">대상분류</div>
          <div class="form-check col-4 col-md-2" v-for="(opt, idx) in radios" :key="idx">
            <input class="form-check-input" type="radio" v-model="selected_radio" :value="opt.item" :id="'radio' + opt.item"
              @change="getDivs">
            <label class="form-check-label" :for="'radio' + opt.item">
              {{opt.name}}
            </label>
          </div>
        </div>
    
        <!-- 구분/카테고리/모달 조회조건 선택 -->
        <div class="row">
          <div class="col-6 col-lg-1 text-center mb-2 fw-bolder" :style="t_overflow">구분</div>
          <div class="col-6 col-lg-2 mb-2">
            <select class="form-select" v-model="selected_div">
              <option v-for="(opt, idx) in divs" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <div class="col-6 col-lg-1 text-center mb-2 fw-bolder" :style="t_overflow">카테고리</div>
          <div class="col-6 col-lg-2 mb-2">
            <select class="form-select" v-model="selected_cate" :disabled="noCate">
              <option v-for="(opt, idx) in cates" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <div class="col-6 col-lg-1 text-center mb-2 fw-bolder" :style="t_overflow">선택</div>
          <div class="col-6 col-lg-2 mb-2">
            <input type="text" class="form-control" :value="modal_val" readonly>
          </div>
          <div class="col-6 col-lg-1 text-center mb-2 fw-bolder" :style="t_overflow">대상</div>
          <div class="col-6 col-lg-2 mb-2">
            <input type="text" class="form-control" :value="modal_val" readonly>
          </div>
        </div>
  
      </div>
  
      <!-- 검사항목 추가/삭제 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7">
            <h4 class="ms-3">선택된 항목</h4>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-3" :style="t_break">적용 가능 항목</h4>
              </div>
              <div class="col-7 text-end">
                <button class="btn btn-info" :style="t_break" @click="getTList">검사항목 불러오기</button>
              </div>
            </div>
          </div>
        </div>
  
        <div class="row mb-4">
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine w-100" style="height: 300px;" :columnDefs="myDefs" :rowData="myData" @grid-ready="gridFit" :gridOptions="gridOptions"/>
          </div>
          <div class="col-2 p-lg-5 p-xxl-6">
            <div class="row">
              <button class="btn btn-success" :style="t_overflow">추가</button>
            </div>
            <div class="row">
              <button class="btn btn-danger" :style="t_overflow">삭제</button>
            </div>
          </div>
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine w-100 h-100" :columnDefs="yetDefs" :rowData="yetData" @grid-ready="gridFit" :gridOptions="gridOptions"/>
          </div>
        </div>
  
        <div class="row">
          <div class="col-2 col-md-1 text-center fw-bolder" :style="t_overflow">
            등록일
          </div>
          <div class="col-5 col-md-3 col-xxl-2">
            <input type="text" class="form-control" :value="date_val" readonly>
          </div>
          <div class="col-5 col-md-4 text-end text-md-start">
            <button class="btn btn-primary me-3" :style="t_overflow">저장</button>
            <button class="btn btn-secondary" :style="t_overflow">초기화</button>
          </div>
        </div>
      </div>
  
    </div>
  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";

  export default {
    name: 'QualityStdAdd',
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},
        
        // 검색조건 전용 값
        selected_radio: null,
        radios: [],
        selected_div: null,
        divs: [],
        noCate: false, // 공정은 카테고리가 없으므로 비활성화용
        selected_cate: null,
        cates: [],
        modal_val: '...',
        date_val: '',

        // grid API 테이블 데이터 (Defs: thead 구성, Data: tbody 구성)
        myDefs: null,
        myData: null,
        yetDefs: [],
        yetData: [],

        gridOptions: null,
        
        // Insert용 양식
        insertData: {
          QU_STD_CD: null, 
          TARGET_TYPE: null, 
          TARGET_CD: null
        }
      }
    },
    components: { 
        AgGridVue // grid API
    },
    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '품질기준 등록'});

      this.getCondition('QT', 'radio');

      // grid API 테이블에 값 불러오기
      // this.myDefs = [
      // { field: 'make' },
      //       { field: 'model' },
      //       { field: 'price' }
      // ];
      // this.myData = [
      // { make: 'Toyota', model: 'Celica', price: 35000 },
      //       { make: 'Ford', model: 'Mondeo', price: 32000 },
      //       { make: 'JoJang', model: 'Boxter', price: 72000 }
  
      // ];
  
      this.gridOptions = {
        pagination: true,
        paginationAutoPageSize: true, // 표시할 수 있는 행을 자동으로 조절함.
        overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
        rowSelection: { 
          mode: 'multiRow'
        }
      };
  
      this.date_val = this.$comm.getMyDay();
    },
    methods: {
      gridFit(params){ // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
        params.api.sizeColumnsToFit();
      },
      
      async getComm(cd){ // 공통코드 가져오기
        let result = await axios.get('/api/commList/' + cd)
                                .catch(err => console.log(err));
        return result.data;
      },
                              
      async getCondition(cd, type){ // 공통코드 기반으로 검색조건 표시하기
        let types = [this.radios, this.divs, this.cates]; // 검색조건으로 들어갈 각각의 input을 배열로 임시저장
        let typesNo = null;
        let arr = await this.getComm(cd);
        
        switch(type){
          case 'radio' : typesNo = 0; break;
          case 'divs' : typesNo = 1; this.selected_div = arr[0].comm_dtl_cd; break;
          case 'cate' : typesNo = 2; this.selected_cate = arr[0].comm_dtl_cd; break;
        };
        
        types[typesNo].length = 0; // 실행할 때마다 값이 중복되지 않게 비우고 push
        for(let i = 0; i < arr.length; i++){
          types[typesNo].push({
            item : arr[i].comm_dtl_cd, // 공통코드
            name : arr[i].comm_dtl_nm // 표시할 한글명
          });
        };
      },

      getDivs(){
        // 구분 및 카테고리 불러오기
        switch(this.selected_radio){
          case 'P01' : // 자재 선택한 경우
            this.getCondition('MA', 'divs');
            this.getCondition('MC', 'cate'); 
            this.noCate = false; 
            break;
          case 'P02' : // 공정중 선택한 경우
            this.getCondition('EQ', 'divs'); 
            this.noCate = true; 
            break;
          case 'P03' : // 제품 선택한 경우
            this.getCondition('PD', 'divs');
            this.getCondition('PC', 'cate'); 
            this.noCate = false; 
            break;
        }
      },

      async axiosGet(val, params){
        let er = '';
        let axiosRes = await axios.get('/api/quality/test/' + 'yet', {params})
                                  .catch(err => er = err);
        // let keys = Object.keys(axiosRes.data[0]);
        console.log(axiosRes.data + er);
        // let defs = [this.yetDefs, this.myDefs];
        // let defNum = null;
        // if(val == 'yet'){
        //   this.yetData = axiosRes.data;
        //   defNum = 0;
        // } else {
        //   this.myData = axiosRes.data;
        //   defNum = 1;
        // }
        // defs[defNum].length = 0;
        // keys.forEach((key) => {
        //   defs[defNum].push({field : key});
        // });
      },

      async getTList(){
        
        let params = {params: {cd: 'PR01', 
                               type : this.selected_radio}};
        

        await this.axiosGet('yet', params);
        // axiosGet('my');

        // let result = await axios.get('/api/quality/test/yet', {params})
        //                         .catch(err => console.log(err));
        // this.yetData = result.data;
        
        // let keys = Object.keys(result.data[0]); // 데이터의 각 키들을 배열로 반환
        // this.yetDefs.length = 0; // 비운 뒤 추가
        // keys.forEach((key) => {
        //   this.yetDefs.push({field : key});
        // });
      },
    }
  };
</script>