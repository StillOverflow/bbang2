<!-- 반품 제품 조회 -->
<template>
  <div class="py-4 container-fluid">
      <div class="card">
          <!-- 검색조건 -->
          <div class="card-header bg-light ps-5 ps-md-4">  
              <div class="d-flex justify-content-center align-items-center text-center">
                  <div class="col-lg-1 text-center mb-2 mt-2 fw-bolder">거래처 명</div>
                  <div class="col-6 col-lg-5 mb-2">
                      <input class="form-control " type="text" placeholder="거래처 이름을 입력 해주세요." v-model="search" v-on:keyup.enter="searchForm" />         
                  </div>
              </div>
              <div class="d-flex justify-content-center align-items-center text-center">
                  <div class="col-lg-1 text-center mb-2 mt-2 fw-bolder">반품 일자</div>
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
          <!-- 반품목록 -->
              <div class="card-body" style="position: relative; height: 550px;">
              <ag-grid-vue
                  style="width: 100%; height: 90%;"
                  class="ag-theme-alpine"
                  :columnDefs="columnDefs"
                  :rowData="rowData"
                  :pagination="true"
                  @grid-ready="gridFit"
                  overlayNoRowsTemplate="반품 제품이 없습니다.">
              </ag-grid-vue>
              <div class="center mt-3">
                    <button class="center btn btn-outline-success mlp10 mtp30" @click="excelDownload()"><i class="fa-regular fa-file-excel"></i> EXCEL</button>
                </div>
              </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import { AgGridVue } from "ag-grid-vue3";
import * as XLSX from 'xlsx';

export default {
  name: 'App',
  data() {
      return {
          columnDefs: [
              {field: 'prd_return_cd', headerName: '반품코드', cellStyle: { textAlign: "center" }},
              {field: 'act_cd', headerName: '거래처코드', cellStyle: { textAlign: "center" }},
              {field: 'act_nm', headerName: '거래처이름', cellStyle: { textAlign: "center" }},
              {field: 'name', headerName: '담당자', cellStyle: { textAlign: "center" }},
              {
                  field: 'prd_return_dt',
                  headerName: '반품일자',
                  valueFormatter: this.$comm.dateFormatter, // 날짜 포맷터 추가
                  cellStyle: { textAlign: "center" }
              },
              {
                  field: 'prd_return_qty',
                  headerName: '반품수량',
                  cellStyle: { textAlign: "center" },
                  valueFormatter: (params) => {
                      if (params.value == null || params.value === '') return '';
                      return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                      
                  },
              },
              {field: 'prd_return_receipt', headerName: '반품접수상태', cellStyle: { textAlign: "center" }, hide: true},
              {
                  headerName: '상세' ,
                  field: 'detailed',
                  cellStyle: { textAlign: "center" },
                  cellRenderer: (params) => {
                      const button = document.createElement('button');
                      button.innerText = '상세보기';
                      button.className = 'btn btn-warning btn-xsm';
                      button.addEventListener('click', () => {
                          
                          this.$router.push({ name: 'Sales_ResultAdd' , query : { bno : params.data.prd_return_cd}});
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
      this.$store.dispatch('breadCrumb', { title: '반품 제품 목록 조회' });
  },
  mounted() {
      axios.get('/api/sales/returnList')
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
          
          axios.get('/api/sales/searchRT/', {params : searchdt})
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
      },

        //엑셀
        excelDownload() {
            // 현재 날짜 생성(엑셀 파일명 용도)
            var today = new Date();
            today = this.$comm.dateFormatter(today);

            // 날짜 포맷 함수 (YYYY-MM-DD)
            const formatDate = (date) => {
            return date ? this.$comm.getMyDay(new Date(date)) : ''; 
            };

            const selectedData = this.rowData.map(item => ({
                '반품코드': item.prd_return_cd,
                '거래처코드': item.act_cd,
                '거래처이름': item.act_nm,
                '담당자': item.name,
                '반품일자': formatDate(item.prd_return_dt),
                '반품수량': Intl.NumberFormat().format(item.prd_return_qty),
            }));

            const workBook = XLSX.utils.book_new()
            const workSheet = XLSX.utils.json_to_sheet(selectedData)
            XLSX.utils.book_append_sheet(workBook, workSheet, 'example')
            XLSX.writeFile(workBook, `반품제품_${today}.xlsx`); 
        }

  }
}
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트  
@import"../../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"


</style>