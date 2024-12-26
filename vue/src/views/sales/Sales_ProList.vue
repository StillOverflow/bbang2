<!-- 제품 재고 조회 -->
<template>
  <div class="py-4 container-fluid">
      <div class="card">
          <!-- 검색조건 -->
          <div class="card-header bg-light ps-5 ps-md-4">  
              <div class="d-flex justify-content-center align-items-center text-center">
                  <div class="col-lg-1 text-center mb-2 mt-2 fw-bolder">제품명</div>
                  <div class="col-6 col-lg-4 mb-2">
                      <input class="form-control " type="text" v-model="search" />         
                  </div>
                  <div class="col-lg-2">
                      <button type="button" class="btn btn-warning m-2" @click="searchForm">
                        <i class="fa-solid fa-magnifying-glass"></i>
                      </button>
                      <button type="button" class="btn btn-secondary m-2" @click="resetBtn">
                        <i class="fa-solid fa-rotate"></i>
                      </button>
                  </div>
              </div>
          </div>
          <!-- 제품 재고 조회 -->
          <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p></p>
                        <ag-grid-vue style="width:100%; height: 550px;"
                        class="ag-theme-alpine"
                        :columnDefs="PALDefs"
                        :rowData="PALData"
                        :pagination="true"
                        @grid-ready="gridFit"
                        overlayNoRowsTemplate="제품 재고가 없습니다.">
                        </ag-grid-vue>
                    </div>
                    <div class="col-md-6">
                        <p></p>
                        <ag-grid-vue style="width:100%; height: 550px;"
                        class="ag-theme-alpine"
                        :columnDefs="PDLDefs"
                        :rowData="PDLData"
                        :pagination="true"
                        @grid-ready="gridFit"
                        overlayNoRowsTemplate="제품을 선택해주세요.">
                        </ag-grid-vue>
                    </div>
                </div>
          </div>
      </div>
  </div>
</template>

<script>

import axios from 'axios';
import { AgGridVue } from "ag-grid-vue3";

export default {
    name: 'App',
    data() {
        return {
            //제품 재고 조회
            PALDefs: [
                {field: 'prd_cd', headerName: '제품코드'},
                {field: 'prd_nm', headerName: '제품명'},
                {
                  field: 'stock', 
                  headerName: '총재고수량',
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {
                    field: 'prd_out_qty',
                    headerName: '출고량',
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {
                    headerName: '상세' ,
                    field: 'detailed',
                    cellRenderer: (params) => {
                        const button = document.createElement('button');
                        button.innerText = 'DETAILED';
                        button.className = 'btn btn-warning btn-xsm';
                        button.addEventListener('click', () => {
                            
                            this.prd_cd = params.data.prd_cd //선택한 행에 제품명 담기
                            this.getOpenLotList(); 

                        });
                        return button;
                    }
                },
            ],
            PALData: [],
            //제품 lot별 조회
            PDLDefs: [
                {field: 'prd_nm', headerName: '제품명'},
                {field: 'prd_lot_cd', headerName: 'LOT'},
                {
                  field: 'stock', 
                  headerName: '재고수량',
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {
                    field: 'exp_dt',
                    headerName: '유통기한',
                    valueFormatter: this.$comm.dateFormatter 
                },
                {
                    field: 'prd_in_dt',
                    headerName: '입고날짜',
                    valueFormatter: this.$comm.dateFormatter 
                },
            ],
            PDLData: [],
            //제품 검색어
            search: '',
            prd_cd: '',
        }
    },
    components: {
        AgGridVue
    },
    created() {
        this.$store.dispatch('breadCrumb', { title: '주문 목록 조회' });
    },
    mounted() {
        axios.get('/api/sales/prdAllList')
            .then(response =>{
                this.PALData = response.data;
            })
            .catch(err => console.log("실패",err));           
    },
    methods: {
        gridFit(params){ 
            params.api.sizeColumnsToFit();
        },

        getOpenLotList(){
            axios.get(`/api/sales/prdLotList/${this.prd_cd}`)
                .then(response =>{
                this.PDLData = response.data;
            })
            .catch(err => console.log("AXIOS실패",err));
        },

        //제품 검색기능
        searchForm(){          
            axios.get(`/api/sales/prdAllList/${this.search}`)
                .then(response =>{
                this.PALData = response.data;
            })
            .catch(err => console.log("AXIOS실패",err));
        },
        resetBtn() { 
            this.search = '';
            this.searchForm();
        }

    }
}
</script>

<style lang="scss">
 
@import"../../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"

</style>
