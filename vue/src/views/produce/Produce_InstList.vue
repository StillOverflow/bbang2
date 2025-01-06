<!-- 생산계획서 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div class="card-header bg-light ps-5 ps-md-4">
        <div class="row">
          <div class="col-3 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">지시서 코드</div>
          <div class="input-group w-30">
            <input class="form-control" type="text" v-model="inst_cd" placeholder="생산지시서 코드를 검색해주세요" style="height: 41px;" v-on:keyup.enter="searchOrder">
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
    this.getStatus();
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
      radios: [],
      selected_radio:'',
      selected_list:'',

      instDefs: [
        { headerName: '지시서코드', field: 'INST_CD', sortable: true, width: 120, cellStyle: {textAlign: "center"}},
        { headerName: '생산제품수', field: 'PRD_CNT', sortable: true, cellStyle: {textAlign: "center"}},
        { headerName: '진행상태', field: 'ACT_TYPE', sortable: true, cellStyle: {textAlign: "center"} },
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
            INST_CD : this.inst_cd,
            STATUS : this.selected_radio
        }
      let result = await axios.get('/api/inst', {params:obj})
                              .catch(err => console.log(err));
      this.instData = result.data;
    },
  }

};

</script>