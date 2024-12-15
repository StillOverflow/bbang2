
<!--ag-grid 테스트 뷰-->

<template>
  <div>
    <!--그리드 사용법-->
    <div>
      <ag-grid-vue style="width:500px; height: 500px;"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
      @grid-ready="gridFit">
      </ag-grid-vue>
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
            gridOptions: null
        }
    },
    components: {
        AgGridVue
    },
    beforeMount() {
        this.columnDefs = [
            { headerName: '제조사', field: 'make', minWidth: 200}, // minWidth 옵션으로 각 열의 최소 너비 지정 가능
            { headerName: '모델', field: 'model'},
            { headerName: '가격', field: 'price' },
        ];

        this.rowData = [
            { make: 'Toyota', model: 'Celica', price: 35000 },
            { make: 'Ford', model: 'Mondeo', price: 32000 },
            { make: 'JoJang', model: 'Boxter', price: 72000 },
            { make: 'Ford', model: 'Mondeo', price: 32000 }
        ];

        this.gridOptions = {
          pagination: true,
          paginationAutoPageSize: true, // 표시할 수 있는 행을 자동으로 조절함.
          rowSelection: { 
              mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
              // enableClickSelection: true (행을 클릭하는 것만으로 한 개 선택 가능.)
          }
        }
    },
    methods: {
      gridFit(params){ // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
        params.api.sizeColumnsToFit();
      }
    }
}
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트 해야하고 경로 확인이 필요함
@import"../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"


</style>