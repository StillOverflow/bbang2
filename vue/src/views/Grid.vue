<!--ag-grid 테스트 뷰-->
<template>
  <div class="py-4 container-fluid">
    <div class="bg-white p-4">
      <div>
        <h4>그리드 사용법</h4>
        <div>
          <ag-grid-vue style="width:600px; height: 500px;" class="ag-theme-alpine" :columnDefs="columnDefs"
            :rowData="rowData" :gridOptions="gridOptions" @grid-ready="myGrid" @rowClicked="rowClicked">
          </ag-grid-vue>
          <button type="button" class="btn btn-light m-3" @click="getGridVal">선택된 값 콘솔로 확인하기</button>
        </div>
      </div>

      <hr>

      <h4>버튼 예시</h4>
      <button class="btn btn-primary">SUBMIT</button> <!-- 등록 -->
      <button class="btn btn-success mlp10">SAVE</button> <!-- 수정 -->
      <button class="btn btn-danger mlp10">DELETE</button>
      <button class="btn btn-secondary mlp10">RESET</button>
      <button class="btn btn-outline-success mlp10">EXCEL</button>
      <div class="input-group mb-3 w-30">
        <input type="search" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" style="height: 41px;">
        <button class="btn btn-warning" type="button" id="button-addon2">SEARCH</button>
      </div>
      <div class="input-group mb-3 w-30">
        <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" style="height: 41px;">
        <button class="btn btn-warning" type="button" id="button-addon3">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// 그리드 사용법
// AG-Grid 공식문서 : https://www.ag-grid.com/javascript-data-grid/row-selection-multi-row/
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: 'App',
  data() {
    return {
      columnDefs: null,
      rowData: null,
      myApi: null,
      myColApi: null,

      gridOptions: {
        pagination: true,
        // paginationPageSize: 10, // 몇 행까지 표시할지 지정하고 싶은 경우
        // paginationPageSizeSelector: false,
        paginationAutoPageSize: true, // 표시할 수 있는 행을 자동으로 조절함.
        overlayNoRowsTemplate: '표시할 값이 없습니다.', // 표시할 행이 없을 때 적용할 메세지'
        suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        rowSelection: {
          mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
          // enableClickSelection: true // (행을 클릭하는 것만으로 singleRow 선택 가능.)
        },
      }
    }
  },
  components: {
    AgGridVue
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: '품번', field: 'no' }, 
      { headerName: '이름', field: 'name', minWidth: 200},  // minWidth 옵션으로 각 열의 최소 너비 지정 가능
      { headerName: '가격', 
        field: 'price', 
        valueFormatter: this.$comm.currencyFormatter, // valueFormatter 천단위 콤마 포맷 함수
        cellClassRules: {
          'textGreen': params => params.value >= 30000
        },
      }, 
      { headerName: '등록일', field: 'date', valueFormatter: this.$comm.dateFormatter } // 날짜 포맷 함수
    ];

    this.rowData = [
      { no: 'MIL021', name: '신선한 Milk', price: 3500, date: this.$comm.getMyDay() },
      { no: 'MAC133', name: '맥모닝 세트', price: 8000, date: '2024-12-02' },
      { no: 'FRU452', name: '금사과', price: 72000, date: '2024-12-03' },
      { no: 'DOM56', name: '도미노 피자', price: 32000, date: '2024-12-04' }
    ];
  },
  methods: {
    myGrid(params) { // 매개변수 속성으로 자동 접근
      console.log(params); // params를 확인해보면 grid에서 쓸 수 있는 모든 메소드가 나옴. (유료버전 포함..)
      params.api.sizeColumnsToFit(); // 가로스크롤 삭제
      this.myApi = params.api;
      this.myColApi = params.columnApi; // api, columnApi 둘 다 꼭 있어야 함
    },
    getGridVal() {
      const val = this.myApi.getSelectedNodes();
      console.log(val);
      if (val.length != 0) { // data 속성에 접근할 시, 선택된 값이 없으면 오류남
        val.forEach((each => console.log(each.data)));
      }
    },
    rowClicked(params){ // 매개변수 속성으로 자동 접근
      this.$swal( // SweetAlert
        '클릭!',
        `행이 클릭되었습니다.
        <br>${params.data.name}를 클릭하셨네요.`,
        'info'
      );
    }
  }
}
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트 해야하고 경로 확인이 필요함
@import"../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"
</style>

<style>
  .textGreen {
    color : rgb(13, 184, 13);
    font-weight: bold;
    text-align: left;
  }
</style>
