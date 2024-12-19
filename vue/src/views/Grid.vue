<!--ag-grid 테스트 뷰-->
<template>
  <div>
    <!--그리드 사용법-->
    <div>
      <ag-grid-vue style="width:500px; height: 500px;" class="ag-theme-alpine" :columnDefs="columnDefs"
        :rowData="rowData" :gridOptions="gridOptions" @grid-ready="myGrid">
      </ag-grid-vue>
      <button type="button" class="btn btn-light m-3" @click="getGridVal">선택된 값 콘솔로 확인하기</button>
    </div>
  </div>

  <button class="btn btn-primary">SUBMIT</button>
  <button class="btn btn-success mlp10">SAVE</button>
  <button class="btn btn-danger mlp10">DELETE</button>
  <button class="btn btn-secondary mlp10">RESET</button>
  <button class="btn btn-outline-success mlp10">EXCEL</button>
  <div class="input-group mb-3 w-30">
  <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" style="height: 41px;">
  <button class="btn btn-warning" type="button" id="button-addon2">SEARCH</button>
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
        }
      }
    }
  },
  components: {
    AgGridVue
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: '제조사', field: 'make', minWidth: 200 }, // minWidth 옵션으로 각 열의 최소 너비 지정 가능
      { headerName: '모델', field: 'model' },
      { headerName: '가격', field: 'price' },
    ];

    this.rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'JoJang', model: 'Boxter', price: 72000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 }
    ];
  },
  methods: {
    myGrid(params) { // 매개변수 속성으로 자동 접근
      params.api.sizeColumnsToFit(); // 가로스크롤 삭제
      this.myApi = params.api;
      this.myColApi = params.columnApi; // api, columnApi 둘 다 꼭 있어야 함
    },
    getGridVal() {
      const val = this.myApi.getSelectedNodes();
      console.log(val);
      if (val.length != 0) { // data 속성에 접근할 시, 선택된 값이 없으면 오류남
        console.log(val[0].data);
      }
    }
  }
}
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트 해야하고 경로 확인이 필요함
@import"../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"
</style>
