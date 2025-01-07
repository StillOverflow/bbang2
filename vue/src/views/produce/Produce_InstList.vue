<!-- 생산계획서 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div class="card-header bg-light ps-5 ps-md-4">
        <div class="row">
          <div class="col-3 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">지시서 코드</div>
          <div class="input-group w-30">
            <input class="form-control" type="text" v-model="inst_cd" placeholder="생산지시서 코드를 검색해주세요" style="height: 41px;" v-on:keyup.enter="searchOrder">
            <button class="btn btn-warning" type="button" @click="searchOrder"><i class="fa-solid fa-magnifying-glass"></i></button>
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
          <div>계획서가 완료된 지시서는 수정/삭제 불가합니다.</div>
        </div>

        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" :columnDefs="instDefs"
          :rowData="instData" :pagination="true" @grid-ready="myGrid" @rowClicked="modalClicked"
          :gridOptions="gridOptions" overlayNoRowsTemplate="등록된 지시서가 없습니다.">
        </ag-grid-vue>
        <div class="center">
          <button class="btn btn-danger mtp30" @click="InstCancel" v-if="this.$session.get('user_ps') == 'H01'">삭제</button>
          <button class="btn btn-outline-success mlp10 mtp30" @click="excelDownload()"><i
              class="fa-regular fa-file-excel"></i> EXCEL</button>
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
    this.$store.dispatch('breadCrumb', { title: '생산지시서 조회' });
    this.getInstList();
  },
  computed: {
    planCount() {
      return this.instData.length;
    }
  },
  data() {
    return {
      rowData: null,
      myApi: null,
      myColApi: null,

      instDefs: [
        { headerName: '계획서코드', field: 'PROD_PLAN_CD', sortable: true, width: 120, cellStyle: {textAlign: "center"}},
        { headerName: '지시서코드', field: 'INST_CD', sortable: true, width: 120, cellStyle: {textAlign: "center"}},
        { headerName: '생산제품수', field: 'PRD_CNT', sortable: true, cellStyle: {textAlign: "center"}},
        { headerName: '계획서 진행상태', field: 'PLAN_STATUS', sortable: true, cellStyle: {textAlign: "center"} },
        { headerName: '작업일자', field: 'WORK_DT', sortable: true, valueFormatter: this.$comm.dateFormatter, cellStyle: {textAlign: "center"} },
        { headerName: '등록일', field: 'CREATE_DT', valueFormatter: this.$comm.dateFormatter, cellStyle: {textAlign: "center"} },
        {
          headerName: '상세' ,
          field: 'detailed',
          cellRenderer: (params) => {
              const button = document.createElement('button');
              button.innerText = '상세보기';
              button.className = 'btn btn-warning btn-xsm';
              button.addEventListener('click', () => {
                  this.$router.push({ name: 'Produce_InstView' , query : { inst_cd : params.data.INST_CD}});
              });
              return button;
          }
        }
      ],
      instData: [],
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
              if (params.data.PLAN_STATUS == '진행중') { 
                return true;
              }
          },
          'rowEnd': (params) => {
              if (params.data.PLAN_STATUS == '완료') { 
                return true;
              }
          },
        },
      }
    };
  },
  methods: {
    myGrid(params) { // 매개변수 속성으로 자동 접근
      params.api.sizeColumnsToFit(); // 가로스크롤 삭제
      this.myApi = params.api;
      this.myColApi = params.columnApi; // api, columnApi 둘 다 꼭 있어야 함
    },

    //지시서 리스트
    async getInstList() {
      let result = await axios.get('/api/inst')
                              .catch(err => console.log(err));
      this.instData = result.data;
    },

    //지시서 삭제
    async InstCancel() {
      
      let selected = null;
      let delArr = [];

      selected = this.myApi.getSelectedNodes();

      selected.forEach((val) => { 
        delArr.push("'"+val.data.INST_CD+"'");
      });      

      let result = await axios.delete(`/api/inst/`, {params:delArr})
                              .catch(err => console.log(err));
      if(result.data == 'success'){
        this.$swal({
            icon: "success",
            title: "삭제완료",
        })
        .then(() => {
            this.getInstList();
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
        '지시코드': item.data.INST_CD,
        '작업일자': item.data.WORK_DT,
        '진행상태': item.data.ACT_TYPE,
        '등록일': item.data.CREATE_DT
      }));

      const workBook = XLSX.utils.book_new()
      const workSheet = XLSX.utils.json_to_sheet(selectedData)
      XLSX.utils.book_append_sheet(workBook, workSheet, 'example')
      XLSX.writeFile(workBook, `생산지시서_${today}.xlsx`);
    },
    async searchOrder() {
      let obj = {
            INST_CD : this.inst_cd
        }
      let result = await axios.get('/api/inst', {params:obj})
                              .catch(err => console.log(err));
      this.instData = result.data;
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