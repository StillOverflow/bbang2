<!-- 주문조회 -->
<template>
    <div class="py-4 container-fluid">
        <div class="card">
            <!-- 검색조건 -->
            <div class="card-header bg-light ps-5 ps-md-4">  
                <div class="d-flex justify-content-center align-items-center text-center">
                    <div class="col-lg-1 text-center mb-2 mt-2 fw-bolder">거래처 명</div>
                    <div class="col-6 col-lg-5 mb-2">
                        <input class="form-control " type="text" v-model="search" />         
                    </div>
                </div>
                <div class="d-flex justify-content-center align-items-center text-center">
                    <div class="col-lg-1 text-center mb-2 mt-2 fw-bolder">주문 일자</div>
                    <div class="col-6 col-lg-2 mb-2">
                        <input class="form-control" type="date" :max="edt" v-model="sdt" />
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">~</div>
                    <div class="col-6 col-lg-2 mb-2">
                        <input class="form-control" type="date" :min="sdt" v-model="edt" />
                    </div>
                </div>
                <div class="d-flex justify-content-center align-items-center mt-3 text-center">
                    <button type="button" class="btn btn-warning m-2" @click="searchForm">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <button type="button" class="btn btn-secondary m-2" @click="resetBtn">
                        <i class="fa-solid fa-rotate"></i>
                    </button>
                </div>
            </div>
            <!-- 주문목록 -->
                <div class="card-body" style="position: relative; height: 550px;">
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
                {field: 'order_cd', headerName: '주문코드', hide: true},
                {field: 'act_cd', headerName: '거래처코드'},
                {field: 'act_nm', headerName: '거래처이름'},
                {field: 'name', headerName: '담당자'},
                {
                    field: 'order_dt',
                    headerName: '주문일자',
                    valueFormatter: this.$comm.dateFormatter // 날짜 포맷터 추가
                },
                {
                    field: 'due_dt',
                    headerName: '납기일자',
                    valueFormatter: this.$comm.dateFormatter 
                },
                {field: 'status', headerName: '현재진행상태'},
                {
                    headerName: '상세' ,
                    field: 'detailed',
                    cellRenderer: (params) => {
                        const button = document.createElement('button');
                        button.innerText = 'DETAILED';
                        button.className = 'btn btn-warning btn-xsm';
                        button.addEventListener('click', () => {

                            this.$router.push({ name: 'sales_orderadd' , query : { bno : params.data.order_cd}});
                        });
                        return button;
                    }
                },
            ],
            rowData: [],
            //거래처,날짜 검색어
            search: "",
            sdt: "",
            edt: "",
        }
    },
    components: {
        AgGridVue
    },
    created() {
        this.$store.dispatch('breadCrumb', { title: '주문 목록 조회' });
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

        //거래처명,날짜 검색기능
        searchForm(){          
            //this.$router.push({ name : 'sales_orderlist', query : { query : this.search, st : this.std, et : this.etd}});
            let searchdt = {no : this.search , st : this.sdt , et : this.edt};
            
            axios.get('/api/sales/search/', {params : searchdt})
                .then(response =>{
                this.rowData = response.data;
            })
            .catch(err => console.log("AXIOS실패",err));
        },
        resetBtn() {
            this.sdt = '';
            this.edt = '';
            this.search = '';
            this.searchForm();
        }

    }
}
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트  
@import"../../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"


</style>