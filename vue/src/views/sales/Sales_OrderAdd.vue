<!-- 주문서 등록 -->
<style>
.form-control[readonly] {
    background-color: rgb(236, 236, 236);
}
</style>
<template>
    <div class="py-4 container-fluid">
        <div class="card">
            <!-- 주문 테이블 부분 -->
            <div class="card-header bg-light ps-5 ps-md-4">
                <div class="row">
                    <div class="col-6 col-lg-2 text-end text-md-start">
                        <button class="btn btn-primary " @click="modalOpen">거래처 조회</button>
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 명</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" value="" readonly />
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 코드</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" value="" readonly />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 col-lg-2 text-end text-md-start">
                        <button class="btn btn-primary " @click="modalOpen">담당자 조회</button>
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">담당자 명</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" value="" readonly />
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">담당자 ID</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" value="" readonly />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 col-lg-2"></div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">납기일자</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="date" value="" />
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">주문일자</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="date" value="" />
                    </div>
                </div>
            </div>
            <!-- 주문디테일 테이블 부분 -->
            <div class="card-body">
                <div class="row">
                    <div class="col-6 col-lg-2 text-end text-md-start">
                        <button class="btn btn-primary " @click="modalOpen">제품 조회</button>
                    </div>
                </div>
                <ag-grid-vue style="width:100%; height: 440px;"
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
    created() {
        this.$store.dispatch('breadCrumb', { title: '주문서 등록' });
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