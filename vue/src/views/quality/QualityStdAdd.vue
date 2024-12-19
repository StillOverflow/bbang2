품질
<template>
  <div class="py-4 container-fluid">
    <div class="card">
  
      <div class="card-header bg-light ps-5 ps-md-4">
        <!-- 대상분류 자재/제품/공정 -->
        <div class="row mb-3">
          <h6 class="col-2 col-lg-1 mb-2 d-flex justify-content-center" :style="t_overflow">대상분류</h6>
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
          <h6 class="col-2 col-lg-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상구분</h6>
          <div class="col-10 col-lg-2 mb-2">
            <select class="form-select" v-model="selected_div">
              <option v-for="(opt, idx) in divs" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-lg-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">카테고리</h6>
          <div class="col-10 col-lg-2 mb-2">
            <select class="form-select" v-model="selected_cate" :disabled="noCate">
              <option v-for="(opt, idx) in cates" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-lg-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">선택</h6>
          <div class="col-10 col-lg-2 mb-2">
            <input type="text" class="form-control" :value="modal_val" readonly>
          </div>
          <h6 class="col-2 col-lg-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상명</h6>
          <div class="col-10 col-lg-2 mb-2">
            <input type="text" class="form-control" :value="modal_val_nm" readonly>
          </div>
        </div>
  
      </div>
  
      <!-- 검사항목 추가/삭제 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7 col-xl-6">
            <h4 class="ms-3">선택된 항목</h4>
          </div>
          <div class="col-5  col-xl-6">
            <div class="row">
              <div class="col-12 col-md-8">
                <h4 class="ms-3" :style="t_overflow">적용 가능 항목</h4>
              </div>
              <div class="col-12 col-md-4 text-center">
                <button class="btn btn-info" :style="t_break" @click="getTList">검사항목 불러오기</button>
              </div>
            </div>
          </div>
        </div>
  
        <div class="row mb-4">
          <div class="col-5 col-xl-5">
            <ag-grid-vue class="ag-theme-alpine w-100"  :style="g_height" :columnDefs="defs" :rowData="myData" @grid-ready="myGrid" :gridOptions="gridOptions"/>
          </div>
          <div class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center">
            <button class="btn btn-info" :style="t_overflow" @click="getSelected('추가')">추가</button>
            <button class="btn btn-danger" :style="t_overflow" @click="getSelected()">삭제</button>
          </div>
          <div class="col-5 col-xl-6">
            <ag-grid-vue class="ag-theme-alpine w-100" :style="g_height" :columnDefs="defs" :rowData="yetData" @grid-ready="yetGrid" :gridOptions="gridOptions"/>
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
            <button class="btn btn-primary me-3" :style="t_overflow" @click="stdInsert">저장</button>
            <button class="btn btn-secondary" :style="t_overflow" @click="getTList">초기화</button>
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
        g_height: {height: '520px'},
        
        // 검색조건 전용 값
        selected_radio: null,
        radios: [],
        selected_div: null,
        divs: [],
        noCate: false, // 공정은 카테고리가 없으므로 비활성화용
        selected_cate: null,
        cates: [],
        modal_val: '...',
        modal_val_nm: '...',
        date_val: '',

        // grid API 테이블 데이터 (Defs: thead 구성, Data: tbody 구성)
        defs: [
          { headerName: '검사명', field: 'test_nm', displayed: false},
          { headerName: '검사방식', field: 'test_metd'},
          { headerName: '검사내용', field: 'test_dtl'}
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
        AgGridVue // grid API
    },
    methods: {
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
        console.log(result);
      },
      
      // 공통코드 기반으로 검색조건 표시하기
      async getComm(cd){ // 공통코드 가져오기
        let result = await axios.get('/api/commList/' + cd)
                                .catch(err => console.log(err));
        return result.data;
      },
                              
      async getCondition(cd, type){ 
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
        // 선택값이 변경될 때마다 구분 및 카테고리 재호출
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

      // 검사항목 버튼 클릭 시 불러오기
      async getTList(){
        const axiosGet = async (val) => { // 'yet' or 'my'에 따라 같은 동작 실행
          let query = {cd: 'PR01', type : this.selected_radio};

          let result = await axios.get('/api/quality/test/' + val, {params: query})
                                .catch(err => console.log(err));
          let data = result.data;
          console.log(data);

          // 각각의 grid 데이터에 넣기
          if(val == 'yet') this.yetData = data;
          else this.myData = data;
        };

        // if modalVal 있는 경우 실행해야 함. (구현전)
        await axiosGet('yet');
        await axiosGet('my');
      },
    },
    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '품질기준 등록'});

      // 대상분류 불러오기
      this.getCondition('QT', 'radio');
    }
  };
</script>