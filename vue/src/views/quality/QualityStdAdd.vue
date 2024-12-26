<!-- 품질 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
  
      <div class="card-header bg-light ps-5 ps-md-4">
          <select-target :modalDefs="modalDefs" :modalTitle="'품질기준 대상선택'"/>
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
                <button class="btn btn-warning mb-2" :style="t_break" @click="getTList">불러오기</button>
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
            <button class="btn btn-outline-primary mbp30" :style="t_overflow" @click="getSelected('plus')"> <!-- (+)버튼 -->
              <i class="fa-solid fa-plus" style="color: #0951ce;"></i>
            </button>
            <button class="btn btn-outline-danger" :style="t_overflow" @click="getSelected()"> <!-- (-)버튼 -->
              <i class="fa-solid fa-minus" style="color: #fa0000;"></i>
            </button>
          </div>
          <div class="col-5 col-xl-6">
            <ag-grid-vue class="ag-theme-alpine w-100"  :style="g_height" :columnDefs="defs" :rowData="myData" 
             @grid-ready="myGrid" :gridOptions="gridOptions"/>
          </div>
        </div>
  
        <div class="row d-flex justify-content-end">
          <h6 class="col-2 col-md-1 text-center" :style="t_overflow">등록일</h6>
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

  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";
  import SelectTarget from "../../components/quality/SelectTarget.vue";

  export default {
    name: 'QualityStdAdd',
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},
        g_height: {height: '520px'},

        // 검색결과 모달에서 출력할 열
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

        // 일반 grid API 데이터
        defs: [
          { headerName: '검사명', field: 'test_nm' },
          { headerName: '검사방식', field: 'test_metd_nm' },
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
        SelectTarget
    },

    created(){ 
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