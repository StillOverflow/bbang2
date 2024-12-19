<!-- 생산 -->
<style>
.modal-container { width:700px; }
.btn { margin-bottom: 0; }
</style>

<template>
  <div class="py-4 container-fluid">
    <div class="card">      
      <div class="card-header bg-light ps-5 ps-md-4">
        
        <p class="text-uppercase text-lg font-weight-bolder">기본정보</p>
        <p for="example-text-input" class="text-sm font-weight-bolder">생산계획코드</p>
          <div class="row">
            <div class="input-group w-30">
              <input class="form-control" type="text" v-model="plan_cd" @click="modalOpen" style="height: 41px;">
            <button class="btn btn-warning" type="button" @click="modalOpen">SEARCH</button>
          </div>
        </div>

        <p for="example-text-input" class="text-sm font-weight-bolder">작업일자</p>
        <input class="form-control w-40" type="date" v-model="work_dt" @click="modalOpen"/>
      </div>

      <div class="card-body">
        
        <div class="row">
          <!--기본정보-->
          <div class="col-md-6">
            <p class="text-uppercase text-lg font-weight-bolder">생산제품 목록</p>
            <div class="table-responsive">
              <table class="table">
                <thead class="table-secondary">
                  <tr>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 제품코드 </th>
                    <th class="text-center text-uppercase text-ser opacity-7"> 제품명 </th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%"> 생산수량</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="planDtlCount >0">
                    <tr :key="i" v-for="(Dtl, i) in planDtlData" @click="prdClicked(Dtl.prd_cd)" class="text-center planDtl" v-bind:id="Dtl.prd_cd+'_dtl'" >
                        <td>{{ Dtl.prd_cd }}</td>
                        <td>{{ Dtl.prd_nm }}</td>
                        <td>{{ Dtl.prod_plan_qty }}</td>
                    </tr>
                  </template>

                  <tr v-else>
                    <td colspan="3">
                      <div class="list-nodata">생산계획코드를 검색해주세요.</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!--공정설정-->
          <div class="col-md-6">

            <p class="text-uppercase text-lg font-weight-bolder">공정 및 자재설정</p>
            <div class="table-responsive">
              <table class="table">
                <thead class="table-secondary">
                  <tr>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 사용유무 </th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 공정코드 </th>
                    <th class="text-center text-uppercase text-ser opacity-7">공정명</th>
                  </tr>
                </thead>   
                <tbody>
                  <template v-if="planFlowCount >0">
                    <tr :key="i" v-for="(Flow, i) in planFlowData" class="text-center planDtl" v-bind:id="Flow.PROC_FLOW_CD+'_dtl'" >
                        <td>{{ Flow.PROC_FLOW_CD }}</td>
                    </tr>
                  </template>

                  <tr v-else>
                    <td colspan="3">
                      <div class="list-nodata">생산계획코드를 검색해주세요.</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="center mtp30">
          <button class="btn btn-primary" @click="instInsert">SUBMIT</button>
          <button class="btn btn-secondary mlp10">RESET</button>
        </div>
      </div>
    </div>
  </div>

  <Layout :modalCheck="isModal">
    <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
      <h5 class="modal-title">생산계획코드 검색</h5>
      <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
    </template>
    <template v-slot:default>
      <ag-grid-vue class="ag-theme-alpine" 
      style="width: 100%; height: 400px;" 
      :columnDefs="planDefs"
      :rowData="planData" 
      @rowClicked="modalClicked" 
      @grid-ready="gridFit"
      @rowIndexChanged="RowIndexChangedEvent"
      overlayNoRowsTemplate="등록된 계획서가 없습니다.">
      </ag-grid-vue>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-secondary" @click="modalOpen">Cancel</button>
      <button type="button" class="btn btn-primary" @click="modalOpen">OK</button>
    </template>
  </Layout>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import Layout from '../components/modalLayout.vue';

export default {
  components: { AgGridVue, Layout },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산지시서 등록' });
    this.getPlanList();
  },
  computed : {
      planDtlCount(){
          return this.planDtlData.length;
      },
      planFlowCount(){
          return this.planFlowData.length;
      }

  },
  el: '#list',
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 }
      ],
      isModal: false,
      flowArr: [],
      matArr: [],
      planDtlData: [],
      planFlowData: [],

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
        suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        rowSelection: { 
            mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
      },
      FlowGridOptions: {
        rowDragManaged: true,
        rowDragMultiRow: true,
        rowDragEntireRow: true,
        suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        rowSelection: { 
            mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
      }

    };
  },
  
  methods: {
    gridFit(params) { // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
      params.api.sizeColumnsToFit();
    },
    /*모달 [S]*/
    modalOpen() {
      this.isModal = !this.isModal;
    },
    modalClicked(params) {
      this.getPlanDtlList(params.data.prod_plan_cd);
      this.plan_cd= params.data.prod_plan_cd;
      this.isModal = !this.isModal;
    },
    /*모달 [E]*/
    
    //계획서 리스트
    async getPlanList() {
      let result = await axios.get('/api/plan')
                              .catch(err => console.log(err));
      this.planData = result.data;
    },

    //계획서 제품 리스트
    async getPlanDtlList(plan_cd) {
      let result = await axios.get(`/api/plan/${plan_cd}/dtl`)
                              .catch(err => console.log(err));                              
      this.planDtlData = result.data;
    },

    //계획서 제품 리스트 선택
    prdClicked(prd_cd) {
      this.getPlanFlowList(); //공정 및 자재설정 리스트 노출

      
      //선택된 생산제품 색깔표기[S]
      const elements = document.querySelectorAll('.planDtl');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('table-warning');
      }
      document.getElementById(prd_cd+'_dtl').classList.add('table-warning');
      //선택된 생산제품 색깔표기[E]
      
    },

     //제품별 공정 리스트
     async getPlanFlowList() {
      let result = await axios.get(`/api/inst/PR01/flow`)
                              .catch(err => console.log(err));                              
      this.planFlowData = result.data;
    },

     /*
    //계획서 제품 공정별 자재 리스트
    async getPlanMatList(prd_cd) {
      let result = await axios.get(`/api/inst/${prd_cd}/mat`)
                              .catch(err => console.log(err));
      this.planMatList = result.data;
    },
    
   
    //공정 선택 시 자재 리스트 노출
    matShow(procFlowCd) {
      const btn = document.getElementById(procFlowCd+'_btn');

      // 자재목록 노출 시 화살표 방향 변경 
      const elements = document.querySelectorAll('.' + procFlowCd);
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.toggle('dnone');
        if (elements[i].classList.contains('dnone')) {
          btn.innerText = "▼";
        }else{
          btn.innerText = "▲";
        }
      }
      // 자재목록 노출 시 화살표 방향 변경
     
    }, */

    //지시서 등록
    async instInsert() {
        
      let obj = {
        PROD_PLAN_CD : this.plan_cd,
        WORK_DT : this.work_dt,
        FLOW : this.flowArr,
        MAT : this.matArr
      }
      console.log(obj);
       /*
      let result = await axios.post('/api/inst', obj)
                              .catch(err => console.log(err));
                              
      return result;*/
      
    },
  }
};

</script>