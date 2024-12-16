<!-- 주문서 등록 -->
<template>
    <div class="py-4 container-fluid">
        <div class="card">
            <!-- 주문 테이블 부분 -->
            <div class="card-header bg-light ps-5 ps-md-4">
            </div>
            <!-- 주문디테일 테이블 부분 -->
            <div class="card-body">
              <ag-grid-vue style="width:100%; height: 300px;"
              class="ag-theme-alpine"
              :columnDefs="columnDefs"
              :rowData="rowData"
              :gridOptions="gridOptions"
              @grid-ready="gridFit">
              </ag-grid-vue>
            </div>
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
            { field: 'four' },
            { field: 'del' },
        ];

        this.rowData = [
            { make: 'Toyota', model: 'Celica', price: 35000, four: 1, del: 'delete'},
            { make: 'Ford', model: 'Mondeo', price: 32000, four: 2, del: 'delete'  },
            { make: 'JoJang', model: 'Boxter', price: 72000, four: 3, del: 'delete'  },
            { make: '왜', model: '안들어가', price: 72000, four: 4, del: 'delete'  }
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
  @import"../../../node_modules/ag-grid-community/styles/ag-grid.css";
  @import"../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"
  
  
  </style>