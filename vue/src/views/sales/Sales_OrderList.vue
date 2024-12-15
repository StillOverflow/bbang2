<!-- 주문조회 -->
<template>
    <div class="py-4 container-fluid">
        <div class="card">
            <!-- 검색조건 -->
            <div class="card-header bg-light ps-5 ps-md-4">  
                <div class="row">
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 명</div> 
                    <div class="col-6 col-lg-3 mb-2">
                        <input class="form-control " type="text" v-model="search" />         
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">주문일자</div>
                    <div class="col-6 col-lg-3 mb-2">
                        <input class="form-control" type="date" value="" />
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">~</div>
                    <div class="col-6 col-lg-3 mb-2">
                        <input class="form-control" type="date" value="" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 col-lg-4 mb-2"></div>
                    <div class="col-6 col-lg-1 mb-2">
                        <button type="button" class="btn mb-0 btn-success btn-xsm null null ms-auto" @click="searchForm">검색</button>
                    </div>
                </div>
            </div>
            <!-- 주문목록 -->
                <div class="card-body" style="position: relative; height: 600px;">
                <ag-grid-vue
                    style="width: 100%; height: 100%;"
                    class="ag-theme-alpine"
                    :columnDefs="columnDefs"
                    :rowData="rowData"
                    :pagination="true"
                    @grid-ready="gridFit">
                </ag-grid-vue>
                </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
//그리드 사용법
import { AgGridVue } from "ag-grid-vue3";

export default {
    name: 'App',
    data() {
        return {
            columnDefs: [
                {field: 'order_cd', headName: '주문코드'},
                {field: 'act_cd', headName: '거래처코드'},
                {field: 'act_nm', headName: '거래처이름'},
                {field: 'name', headName: '담당자'},
                {field: 'order_dt', headName: '주문일자'},
                {field: 'due_dt', headName: '납기일자'},
                {field: 'status', headName: '현재진행상태'},
            ],
            rowData: [],
            //거래처 검색어
            search: ""
        }
    },
    components: {
        AgGridVue
    },
    mounted() {
        axios.get('/api/sales')
            .then(response =>{
                this.rowData = response.data;
            })
            .catch(err => console.log("실패",err));           
    },
    methods: {
        gridFit(params){ // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
            params.api.sizeColumnsToFit();
        },
        //거래처명 검색기능
        searchForm(){          
            this.$router.push({ name : 'sales_orderlist', query : { query : this.search}});
            axios.get('/api/sales/'+ this.search)
                .then(response =>{
                this.rowData = response.data;
            })
            .catch(err => console.log("실패",err));
        }

    }
}
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트  
@import"../../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"


</style>