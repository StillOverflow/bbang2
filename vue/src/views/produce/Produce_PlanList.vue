<!-- 생산계획서 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">      
      <div class="card-header bg-light ps-5 ps-md-4">
        
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" 
        :columnDefs="planDefs"
        :rowData="planData"
        :pagination="true" 
        :gridOptions="gridOptions"
        @rowClicked="modalClicked" 
        @grid-ready="myGrid"
        overlayNoRowsTemplate="등록된 계획서가 없습니다.">
        </ag-grid-vue>
        <div class="center mtp30">
          <button class="btn btn-warning" @click="PlanCancel">계획취소</button>
          <button class="btn btn-success mlp10">엑셀다운로드</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  components: { AgGridVue },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산계획서 조회' });
    this.getPlanList();
    
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
      /* 모달 계획서 목록 */
      planDefs: [
        { headerName: '계획서코드', field: 'prod_plan_cd', sortable: true, width: 120 },
        { headerName: '생산시작일', field: 'start_dt', sortable: true, valueFormatter: this.$comm.dateFormatter, width: 150  },
        { headerName: '생산종료일', field: 'end_dt', sortable: true, valueFormatter: this.$comm.dateFormatter, width: 150 },
        { headerName: '제품수량', field: 'dtl_qty', sortable: true, width: 100},
        { headerName: '등록일', field: 'create_dt', valueFormatter: this.$comm.dateFormatter, width: 150 },
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
      
      let cancelArr = [];

      const val = this.myApi.getSelectedNodes();
      for(let i=0; i<val.length; i++){
        cancelArr.push({chkVal : val[i].data.prod_plan_cd });
      }
      let result = await axios.delete(`/api/plan/`, {params : cancelArr})
                              .catch(err => console.log(err));
      return result;
      
    },
  }
};

</script>