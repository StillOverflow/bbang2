<!-- 생산계획서 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">      
      <div class="card-header bg-light ps-5 ps-md-4">

        <div class="row">
          <div class="col-3 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">계획서 코드</div>
          <div class="input-group w-30">
            <input class="form-control" type="text" v-model="plan_cd" :v-bind="this.plan_cd" placeholder="생산지시서 코드를 검색해주세요" style="height: 41px;">
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
      <div class="alert alert-success alert-dismissible fade show">
        <strong>Success!</strong> Your message has been sent successfully.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>

      <div class="card-header ps-5 ps-md-4">
        <div class="bg-secondary-subtle p-2" style="--bs-bg-opacity: .5;">진행중이거나 완료된 계획서는 수정/삭제 불가합니다.</div>
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
          <button class="btn btn-danger mtp30" @click="PlanCancel">DELETE</button>
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
        { headerName: '계획서코드', field: 'PROD_PLAN_CD', sortable: true, width: 120 },
        { headerName: '진행상태', field: 'ACT_TYPE', sortable: true },
        { headerName: '생산시작일', field: 'START_DT', sortable: true, valueFormatter: this.$comm.dateFormatter, width: 150  },
        { headerName: '생산종료일', field: 'END_DT', sortable: true, valueFormatter: this.$comm.dateFormatter, width: 150 },
        { headerName: '제품수량', field: 'DTL_QTY', sortable: true, width: 100},
        { headerName: '등록일', field: 'CREATE_DT', valueFormatter: this.$comm.dateFormatter, width: 150 },
        {
          headerName: '상세' ,
          field: 'detailed',
          cellRenderer: (params) => {
              const button = document.createElement('button');
              button.innerText = 'DETAILED';
              button.className = 'btn btn-warning btn-xsm';
              button.addEventListener('click', () => {
                  this.$router.push({ name: 'Produce_PlanAdd' , query : { plan_cd : params.data.PROD_PLAN_CD}});
              });
              return button;
          }
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
        }
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
          title: "선택한 계획서를 삭제하였습니다.",
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