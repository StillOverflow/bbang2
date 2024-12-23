<!-- 생산계획서 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">      
      <div class="card-header bg-light ps-5 ps-md-4">
        
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" 
        :columnDefs="instDefs"
        :rowData="instData"
        :pagination="true" 
        @grid-ready="myGrid"        
        @rowClicked="modalClicked" 
        :gridOptions="gridOptions"        
        overlayNoRowsTemplate="등록된 지시서가 없습니다.">
        </ag-grid-vue>
        <div class="center mtp30">
          <button class="btn btn-danger" @click="PlanCancel">DELETE</button>
          <button class="btn btn-outline-success mlp10" @click="excelDownload()"><i class="fa-regular fa-file-excel"></i> EXCEL</button>
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
    this.getPlanList();
    
  },
  computed : {
      planCount(){
          return this.instData.length;
      }
  },
  data() {
    return {
      rowData: null,
      myApi: null,
      myColApi: null,

      instDefs: [
        { headerName: '지시서코드', field: 'INST_CD', sortable: true, width: 120 },        
        { headerName: '생산제품수', field: 'PRD_CNT', sortable: true },
        { headerName: '진행상태', field: 'ACT_TYPE', sortable: true},
        { headerName: '작업일자', field: 'WORK_DT', sortable: true, valueFormatter: this.$comm.dateFormatter },
        { headerName: '등록일', field: 'CREATE_DT', valueFormatter: this.$comm.dateFormatter},
      ],
      instData: [],
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
    myGrid(params){ // 매개변수 속성으로 자동 접근
      params.api.sizeColumnsToFit(); // 가로스크롤 삭제
      this.myApi = params.api;
      this.myColApi = params.columnApi; // api, columnApi 둘 다 꼭 있어야 함
    },
    
    //계획서 리스트
    async getPlanList() {
      let result = await axios.get('/api/inst')
                              .catch(err => console.log(err));
      this.instData = result.data;
    },

    //지시서 삭제
    async InstCancel() {
      
      let cancelArr = [];

      const val = this.myApi.getSelectedNodes();
      for(let i=0; i<val.length; i++){
        cancelArr.push(val[i].data.inst_cd);
      }
      
      let result = await axios.delete(`/api/inst/`,cancelArr )
                              .catch(err => console.log(err));
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
    }
  }
    
};

</script>