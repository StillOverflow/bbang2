<!-- 생산계획서 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">      
      <div class="card-header bg-light ps-5 ps-md-4">

        <div class="row">
          <div class="col-3 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">계획서 코드</div>
          <div class="input-group w-30">
            <input class="form-control" type="text" v-model="plan_cd" :v-bind="this.plan_cd" placeholder="생산계획서 코드를 검색해주세요" style="height: 41px;" v-on:keyup.enter="searchOrder">
            <button class="btn btn-warning mb-3" type="button" @click="searchOrder"><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>
        </div>


        <div class="row">
          <div class="col-3 col-lg-1 text-center fw-bolder" style="white-space: nowrap;">진행상태</div>
          <div class="form-check col-10 d-flex">
            <div v-for="(opt, idx) in radios" :key="idx">
              <input class="form-check-input ms-1" type="radio" v-model="selected_radio" :value="opt.comm_dtl_cd" :id="'radio' + opt.comm_dtl_cd" @change="searchOrder">
              <label class="form-check-label ms-2 me-4 text-start" :for="'radio' + opt.comm_dtl_cd">
                {{opt.comm_dtl_nm}}
              </label>
            </div>
          </div>
        </div>
      </div>
      

      <div class="card-header ps-5 ps-md-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
          <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </symbol>
        </svg>
        <div class="alert alert-warning d-flex align-items-center" role="alert">
          <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
          <div>진행중이거나 완료된 계획서는 수정/삭제 불가합니다.</div>
        </div>
        
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" 
        :columnDefs="planDefs"
        :rowData="planData"
        :pagination="true" 
        @grid-ready="myGrid"        
        @rowClicked="modalClicked"
        :gridOptions="gridOptions"       
        overlayNoRowsTemplate="등록된 계획서가 없습니다.">
        </ag-grid-vue>
        <div class="center">
          <button class="btn btn-danger mtp30" @click="PlanCancel" v-if="this.$session.get('user_ps') == 'H01'">삭제</button>
          <button class="btn btn-outline-success mlp10 mtp30" @click="excelDownload()"><i class="fa-regular fa-file-excel"></i> EXCEL</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
  components: { AgGridVue },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산계획서 조회' });
    this.getPlanList();
    this.getStatus();
    
  },
  computed : {
      planCount(){
          return this.planData.length;
      }
  },
  data() {
    return {
      rowData: null,
      myApi: null,
      myColApi: null,
      radios: [],
      selected_radio:'',
      selected_list:'',
      
      planDefs: [
        { headerName: '계획서코드', field: 'PROD_PLAN_CD', sortable: true, width: 100,cellStyle: {textAlign: "center"} },
        { headerName: '진행상태', field: 'ACT_TYPE', sortable: true, width: 100, cellStyle: {textAlign: "center"}},
        { headerName: '생산시작일', field: 'START_DT', sortable: true, valueFormatter: this.$comm.dateFormatter, width: 120, cellStyle: {textAlign: "center"}},
        { headerName: '생산종료일', field: 'END_DT', sortable: true, valueFormatter: this.$comm.dateFormatter, width: 120, cellStyle: {textAlign: "center"}},
        { headerName: '제품수량', field: 'DTL_QTY', sortable: true, width: 100, cellStyle: {textAlign: "center"}},
        { headerName: '등록일', field: 'CREATE_DT', valueFormatter: this.$comm.dateFormatter, width: 100, cellStyle: {textAlign: "center"}},
        {
          headerName: '상세' ,
          field: 'detailed',
          cellRenderer: (params) => {
              const button = document.createElement('button');
              button.innerText = '상세보기';
              button.className = 'btn btn-warning btn-xsm';
              button.addEventListener('click', () => {
                  this.$router.push({ name: 'Produce_PlanAdd' , query : { plan_cd : params.data.PROD_PLAN_CD}});
              });
              return button;
          },
          width: 100 
        }
      ],
      planData: [],
      gridOptions: {
        pagination: true,
        paginationAutoPageSize: true, // 표시할 수 있는 행을 자동으로 조절함.
        overlayNoRowsTemplate: '표시할 값이 없습니다.', // 표시할 행이 없을 때 적용할 메세지'
        suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        rowSelection: { 
            mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
        },
        // row에 규칙추가
        rowClassRules: {
          'rowIng': (params) => {
              if (params.data.ACT_TYPE == '진행중') { // 부족 수량이 있으면 ~~ 
                return true;
              }
          },
          'rowEnd': (params) => {
              if (params.data.ACT_TYPE == '완료') { // 부족 수량이 있으면 ~~ 
                return true;
              }
          },
        },
      }
    };
  },
  methods: {
    async getStatus() {
      let arr = await this.$comm.getComm("PS");
      let arrAdd = {comm_dtl_cd: '', comm_dtl_nm: '전체'};
      arr.unshift(arrAdd);
      this.radios = arr;
      
    },
    myGrid(params){ // 매개변수 속성으로 자동 접근
      params.api.sizeColumnsToFit(); // 가로스크롤 삭제
      this.myApi = params.api;
      this.myColApi = params.columnApi; // api, columnApi 둘 다 꼭 있어야 함
    },
    
    //계획서 리스트
    async getPlanList() {
      let result = await axios.get('/api/plan')
                              .catch(err => console.log(err));
      this.planData = result.data;
    },

    //계획서 삭제
    async PlanCancel() {
      
      let selected = null;
      let delArr = [];

      selected = this.myApi.getSelectedNodes();

      selected.forEach((val) => { 
        delArr.push("'"+val.data.PROD_PLAN_CD+"'");
      });            
      let result = await axios.delete(`/api/plan/`, {params:delArr})
                              .catch(err => console.log(err));
      if(result.data == 'success'){
        this.$swal({
          icon: "success",
          title: "삭제완료",
        })
        .then(() => {
          this.getPlanList();
        });          
      }else{
        this.$swal({
          icon: "error",
          title: "진행중인 계획서는 삭제할 수 없습니다.",
        })
        .then(() => {
          this.getPlanList();
        });     
      }
      return result;
    },
    excelDownload() {
      var today = new Date();
      today = this.$comm.dateFormatter(today);
      let selected = null;

      selected = this.myApi.getSelectedNodes();
      const selectedData = selected.map(item => ({
          '계획서코드': item.data.PROD_PLAN_CD,
          '생산시작일': item.data.START_DT,
          '생산종료일': item.data.END_DT,
          '제품수량': item.data.DTL_QTY,
          '등록일': item.data.CREATE_DT
      }));

      const workBook = XLSX.utils.book_new()
      const workSheet = XLSX.utils.json_to_sheet(selectedData)
      XLSX.utils.book_append_sheet(workBook, workSheet, 'example')
      XLSX.writeFile(workBook, `생산계획서_${today}.xlsx`); 
    },
    async searchOrder() {
      let obj = {
        PROD_PLAN_CD : this.plan_cd,
        STATUS : this.selected_radio
      }
      let result = await axios.get('/api/plan', {params:obj})
                              .catch(err => console.log(err));
      this.planData = result.data;
    },
  }
};
</script>

<style>
.rowIng {
  background-color: #fff3cd !important; /* 셀 배경 빨간색 */
}
.rowEnd {
  background-color: #eee !important; /* 셀 배경 빨간색 */
  color: gray !important;
}
</style>