품질
<template>
  <div class="py-4 container-fluid">
    <div class="card">
  
      <div class="card-header bg-light ps-5 ps-md-4">
        <!-- 조회대상 자재/제품/공정 -->
        <div class="row mb-3">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex justify-content-center" :style="t_overflow">조회대상</h6>
          <div class="form-check col-10 d-flex">
            <div v-for="(opt, idx) in radios" :key="idx">
              <input class="form-check-input ms-1" type="radio" v-model="selected_radio" :value="opt.item" :id="'radio' + opt.item"
               @change="changeDivs()">
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
              <option :value="null">전체</option>
              <option v-for="(opt, idx) in divs" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">카테고리</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="selected_cate" :disabled="noCate">
              <option :value="null">전체</option>
              <option v-for="(opt, idx) in cates" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상선택</h6>
          <div class="col-10 col-lg-4 col-xxl-2 d-flex">
            <div class="input-group">
              <input type="search" class="form-control" v-model="modal_val.nm" style="height: 41px;">
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
            <button class="btn btn-outline-primary" :style="t_overflow" @click="getSelected('plus')">
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
          <div class="col-4 col-md-2 text-center">
            <button class="btn btn-primary" :style="t_overflow" @click="stdInsert">SUBMIT</button>
            <!-- <button class="btn btn-secondary" :style="t_overflow" @click="getTList">RESET</button> -->
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
            :gridOptions="gridOptions" :rowSelection="false" @rowClicked="modalSelect"/>
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
          { headerName: '카테고리', field: 'category', width: 90 },
          { headerName: '코드', field: 'cd', width: 80 },
          { headerName: '이름', field: 'nm', width: 126 },
          { headerName: '등록현황', 
            field: 'has_std', 
            cellClassRules: {
              'textRed': params => params.value == '미등록',
              'textGreen': params => params.value == '등록완료'
            },
            width: 100 },
          { headerName: '마지막 등록일', field: 'std_date', width: 120, valueFormatter: this.$comm.dateFormatter_returnNull}
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
        myData_save: new Set(), // 등록 시 비교용으로 임시저장하는 변수
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
          },
          onRowClicked: (params) => {
            this.$swal({
              title: `<h4>${params.data.test_nm} 검사</h4>`,
              text: params.data.test_dtl,
              showConfirmButton: false
            });
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
      this.$store.dispatch('breadCrumb', {title: '품질기준 관리'});

      // 조회대상 불러오기
      this.getCondition('QT', 'radio');
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

      // 대상구분 변경될 때 동작
      async changeDivs(modal){ // 모달에서 실행한 경우 매개변수를 넘겨받음 (선택된 값 초기화 방지)
        // 그리드 테이블 내용과 대상을 null로 초기화
        this.modal_val.cd = null;
        this.myData = [];
        this.yetData = [];
      
        if(!modal){ // 매개변수가 없이 실행되면 선택된 div, cate도 모두 null로 초기화
          this.selected_div = null;
          this.selected_cate = null;
        }

        // 구분 및 카테고리 재호출
        switch(this.selected_radio){
          case 'P01' : // 자재 선택한 경우
            this.getCondition('MA', 'divs');
            this.getCondition('MC', 'cate'); 
            this.noCate = false; 
            break;
          case 'P02' :  // 공정중 선택한 경우
            this.noCate = true; // 구분 선택이 아예 없음.
            break;
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
          cate_type: this.selected_div,
          cate: this.selected_cate,
          nm: this.modal_val.nm 
        };

        let result = await axios.get('/api/quality/targetAll', {params: params})
                                .catch(err => console.log(err));
        let data = result.data;
        data.forEach((obj) => {
          obj.has_std = obj.std_date == null ? '미등록' : '등록완료'; // SELECT문 컬럼에 포함되지 않았으므로 추가
        });
        this.modalData = data;
      },
      
      modalSelect(params){ // @rowClicked
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
        this.myData_save = new Set();
        this.modalToggle();
      },
      // ---------- 모달 메소드 끝 -----------

      // 임시저장 (기존 값과 변경되었는지 확인하기 위한 비교용)
      saveData(data){
        let myDataSet = new Set(); // 순서에 상관없이 비교하기 위해 Set 사용
        data.forEach((obj) => {
          myDataSet.add(obj.test_cd);
        });
        this.myData_save = myDataSet; 
      },

      // 검사항목 버튼 클릭 시 불러오기
      async getTList(){
        // 'yet' or 'my'에 따라 같은 동작 실행하는 함수 선언
        const axiosGet = async (val) => { 
          let query = {cd: this.modal_val.cd, type: this.selected_radio};

          let result = await axios.get('/api/quality/test/' + val, {params: query})
                                  .catch(err => console.log(err));
          let data = result.data;

          // 각각의 grid 데이터 넣기 실행
          if(val == 'yet'){ // 미적용 항목들
            this.yetData = data;
          } else { // 적용중인 항목들
            this.myData = data;
            this.saveData(data);
          }
        };
        
        if(this.modal_val.cd){ // 코드가 정확히 선택되었을 경우에만 동작
          await axiosGet('yet');
          await axiosGet('my');
        } else {
          this.$swal(
            '대상 미선택',
            '대상을 정확히 선택해주세요.',
            'warning'
          );
        }
      },

      // 추가(+) / 삭제(-) 버튼 동작
      getSelected(type){
        let selected = null;
        if(type == 'plus') selected = this.yetApi.getSelectedNodes(); // 추가버튼일 시
        else selected = this.myApi.getSelectedNodes(); // 삭제버튼일 시

        if(selected.length != 0){ // 선택된 값이 있을 경우에만 실행
          // grid는 참조형식이라 개별값을 직접 조작할 수 없으므로 가상의 배열 선언
          let addArr = [];
          let changeArr = null;
          if(type == 'plus') changeArr = this.yetData;
          else changeArr = this.myData;
          
          selected.forEach((val) => { // 선택된 값을 순회, 비교하며 배열에서 추가/삭제 실행
            addArr.push(val.data);
            changeArr = changeArr.filter(obj => obj.test_nm != val.data.test_nm); // 선택되지 않은 것만 남김
          });
          
          // 수정된 배열로 반영하기
          if(type == 'plus'){
            this.yetData = changeArr;
            this.myData = [...this.myData, ...addArr]; // 펼침연산자로 기존의 값에 추가함
          } else {
            this.myData = changeArr;
            this.yetData = [...this.yetData, ...addArr];
          }
        }
      },

      // SUBMIT
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
            '최소한 1개 이상의 항목이 선택되어야 합니다.',
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