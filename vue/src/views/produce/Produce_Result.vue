<!-- 생산계획서 조회 -->
<template>
  <div class="py-4 container-fluid" @keydown.esc="modalCloseFunc">
    <div class="card">
      <div class="card-header bg-light ps-5 ps-md-4">
        <div class="row">
          <div class="col-3 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">지시서 코드</div>
          <div class="input-group w-30">
            <input class="form-control" type="text" v-model="inst_cd" @click="modalOpen" placeholder="생산지시서 코드를 검색해주세요" style="height: 41px;">
            <button class="btn btn-warning mb-3" type="button" @click="modalOpen"><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>
        </div>

        <!--생산지시서 검색모달[S]-->
        <Layout :modalCheck="isModal">
            <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
              <h5 class="modal-title">생산지시서 검색</h5>
              <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
            </template>
            <template v-slot:default>
              <ag-grid-vue class="ag-theme-alpine" 
              style="width:100%; height:250px;" 
              :columnDefs="instDefs"
              :rowData="instData" 
              @rowClicked="modalClicked" 
              :grid-options="modalOptions"
              overlayNoRowsTemplate="등록된 지시서가 없습니다.">
              </ag-grid-vue>
            </template>
            <template v-slot:footer>
              <button type="button" class="btn btn-secondary" @click="modalOpen">Cancel</button>
              <button type="button" class="btn btn-primary" @click="modalOpen">OK</button>
            </template>
          </Layout>
        <!--생산지시서 검색모달[E]-->

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
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 500px;" 
        :columnDefs="resultDefs"
        :rowData="resultData" 
        :pagination="true" 
        @grid-ready="myGrid" 
        :gridOptions="gridOptions" 
        overlayNoRowsTemplate="등록된 실적이 없습니다.">
        </ag-grid-vue>
        <div class="center">
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
import Layout from '../components/modalLayout.vue';

export default {
  components: { AgGridVue, Layout },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산실적 조회' });
    this.getStatus();
  },
  computed: {
    planCount() {
      return this.instData.length;
    }
  },
  data() {
    return {
      isModal: false, //지시서 모달
      rowData: null,
      myApi: null,
      myColApi: null,
      radios: [],
      selected_radio:'',
      selected_list:'',
      instDtlData: [],

      instDefs: [
        { headerName: '지시서코드', field: 'INST_CD', sortable: true, width: 120 },
        { headerName: '생산제품수', field: 'PRD_CNT', sortable: true, width: 120 },
        { headerName: '진행상태', field: 'ACT_TYPE', sortable: true, width: 120 },
        { headerName: '작업일자', field: 'WORK_DT', sortable: true, valueFormatter: this.$comm.dateFormatter, width: 150  },
        { headerName: '등록일', field: 'CREATE_DT', valueFormatter: this.$comm.dateFormatter, width: 150 },
      ],
      instData: [],

      resultDefs: [        
        {
          headerName: '제품명', field: "PRD_NM",
          rowSpan: (params) => {
               const rowIndex = params.node.rowIndex;
               const prd_cd = params.data.PRD_CD;

               if ( rowIndex > 0 && params.api.getDisplayedRowAtIndex(rowIndex - 1).data.PRD_CD === prd_cd ) {
                  return 0; // 병합 내부 셀
               }

               let span = 1;

               for (let i = rowIndex + 1; i <= params.api.getLastDisplayedRowIndex(); i++) {
                  const nextRowNode = params.api.getDisplayedRowAtIndex(i);
                  
                  if (nextRowNode && nextRowNode.data.PRD_CD === prd_cd) {
                     span++;
                  } else {
                     break;
                  }
               }
               
               return span;
            },
            cellClassRules: {
               "cell-span": (params) => {
                  if (!params) {
                     return false;
                  }
                  return params.value !== undefined;
               },
            },
         },        
        { headerName: '순번', field: 'STEP', sortable: true, width: 120, cellStyle: {textAlign: "center"}},
        { headerName: '공정명', field: 'PROC_NM', sortable: true, cellStyle: {textAlign: "center"}},
        { headerName: '담당자', field: 'NAME', cellStyle: {textAlign: "center"}},
        { headerName: '설비명', field: 'EQP_NM', cellStyle: {textAlign: "center"}},
        { headerName: '계획량', field: 'TOTAL_QTY', cellStyle: {textAlign: "center"}},
        { headerName: '지시량', field: 'PROD_QTY', cellStyle: {textAlign: "center"}},
        { headerName: '불량양', field: 'DEF_QTY', cellStyle: {textAlign: "center"}},
        { headerName: '불량코드', field: 'CREATE_DT', cellStyle: {textAlign: "center"}},
        { headerName: '불량상세', field: 'CREATE_DT', cellStyle: {textAlign: "center"}},
        { 
          headerName: '공정시작시간', 
          field: 'START_TIME', 
          valueFormatter: (params) => this.$comm.getDatetimeMin(params.value)
          , cellStyle: {textAlign: "center"}
        },
        { 
          headerName: '공정종료시간', 
          field: 'END_TIME', 
          valueFormatter: (params) => this.$comm.getDatetimeMin(params.value)
          , cellStyle: {textAlign: "center"}
        },
        { headerName: '진행상태', field: 'ACT_TYPE', sortable: true, cellStyle: {textAlign: "center"} }
      ],
      resultData: [],
      
      gridOptions: {
        pagination: true,
        suppressRowTransform: true,
        overlayNoRowsTemplate: '표시할 값이 없습니다.', // 표시할 행이 없을 때 적용할 메세지'
        suppressMovableColumns: true, // 컬럼 드래그 이동 방지
      }
    };
  },
  methods: {
    
    modalOpen() { //지시서 모달
      this.isModal = !this.isModal;
      this.getInstList();
    },
    modalClicked(params) {
      this.isModal = !this.isModal;
      this.inst_cd= params.data.INST_CD;      
      this.getResultList(); 
    },
    modalCloseFunc() {
      if(this.isModal){
        this.isModal = !this.isModal;
      }
    },

    //지시서 리스트
    async getInstList() {
      let result = await axios.get('/api/inst')
                              .catch(err => console.log(err));
      this.instData = result.data;
    },
    
    //지시서 제품 리스트
    async getInstDtlList() {
      let result = await axios.get(`/api/inst/dtl/${this.inst_cd}`)
                              .catch(err => console.log(err));
      this.instDtlData = result.data;
    },

    async getStatus() {
      let arr = await this.$comm.getComm("PS");
      let arrAdd = {comm_dtl_cd: '', comm_dtl_nm: '전체'};
      arr.unshift(arrAdd);
      this.radios = arr;
      
    },
    myGrid(params) { // 매개변수 속성으로 자동 접근
      params.api.sizeColumnsToFit(); // 가로스크롤 삭제
      this.myApi = params.api;
      this.myColApi = params.columnApi; // api, columnApi 둘 다 꼭 있어야 함
    },

    //실적 리스트
    async getResultList() {
      let obj = {
        INST_CD : this.inst_cd,
      }
      let result = await axios.get('/api/progress/result', {params:obj})
                              .catch(err => console.log(err));
      this.resultData = result.data;
    },

    excelDownload() {
      var today = new Date();
      today = this.$comm.dateFormatter(today);
      let selected = null;

      selected = this.myApi.getSelectedNodes();
      const selectedData = selected.map(item => ({
        '순번': item.data.STEP,
        '제품코드': item.data.PRD_CD,
        '담당자': item.data.NAME,
        '공정명': item.data.PROC_NM,
        '설비명': item.data.EQP_NM,
        '계획량': item.data.TOTAL_QTY,
        '지시량': item.data.PROD_QTY,
        '불량양': item.data.DEF_QTY,
        '불량코드': item.data.CREATE_DT,
        '불량상세': item.data.CREATE_DT,
        '공정시작시간': item.data.START_TIME,
        '공정종료시간': item.data.END_TIME,
        '진행상태': item.data.ACT_TYPE
      }));

      const workBook = XLSX.utils.book_new()
      const workSheet = XLSX.utils.json_to_sheet(selectedData)
      XLSX.utils.book_append_sheet(workBook, workSheet, 'example')
      XLSX.writeFile(workBook, `생산실적_${today}.xlsx`);
    },
    async searchOrder() {
      let obj = {
            INST_CD : this.inst_cd,
            STATUS : this.selected_radio
        }
      let result = await axios.get('/api/progress/result', {params:obj})
                              .catch(err => console.log(err));
      this.resultData = result.data;
    },
  }

};

</script>