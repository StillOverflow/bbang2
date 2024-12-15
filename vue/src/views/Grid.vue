
<!--ag-grid 테스트 뷰-->

<template>
  <div>
    <!--그리드 사용법-->
    <div>
      <ag-grid-vue style="width:500px; height: 500px;"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      @grid-ready="gridFit">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
//그리드 사용법
import { AgGridVue } from "ag-grid-vue3";

export default {
    name: 'App',
    data() {
        return {
            columnDefs: null,
            rowData: null
        }
    },
    components: {
        AgGridVue
    },
    beforeMount() {
        this.columnDefs = [
            { field: 'make' },
            { field: 'model' },
            { field: 'price' },
        ];

        this.rowData = [
            { make: 'Toyota', model: 'Celica', price: 35000 },
            { make: 'Ford', model: 'Mondeo', price: 32000 },
            { make: 'JoJang', model: 'Boxter', price: 72000 }
        ];
    },
    methods: {
      gridFit(params){ // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
        params.api.sizeColumnsToFit();
      }
    }
}
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트 해야하고 경로 확인이 필요하다 
@import"../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"


</style>