<!-- 생산 -->
<style>
.modal-container { width:700px; }
</style>

<template>
  <div class="py-4 container-fluid" @keydown.esc="modalCloseFunc">
    <div class="card">      
      <div class="card-header bg-light ps-5 ps-md-4">

        <!--기본정보-->
        <p class="text-uppercase text-lg font-weight-bolder">기본정보</p>
        <p for="example-text-input" class="text-sm font-weight-bolder">생산계획코드 <em class="point-red">*</em></p>
          <div class="row">
            <div class="input-group w-30">
              <input class="form-control" type="text" v-model="plan_cd" placeholder="생산계획코드를 검색해주세요" style="height: 41px;" readonly>
              <button class="btn btn-warning mb-3" type="button" @click="modalOpen"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>

        <p for="example-text-input" class="text-sm font-weight-bolder">작업일자</p>
        <input class="form-control w-30" type="date" v-model="work_dt"/>
      </div>

       <!--검색모달[S]-->
        <Layout :modalCheck="isModal">
          <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
            <h5 class="modal-title">생산계획코드 검색</h5>
            <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
          </template>
          <template v-slot:default>
            <div class="alert alert-primary d-flex align-items-center" role="alert">
              <div>완료된 계획서는 제외된 결과입니다.</div>
            </div>

            <ag-grid-vue class="ag-theme-alpine" 
            style="width: 100%; height: 400px;" 
            :columnDefs="planDefs"
            :rowData="planData" 
            @grid-ready="gridFit"
            @rowClicked="modalClicked" 
            :grid-options="modalOptions"
            @rowIndexChanged="RowIndexChangedEvent"
            overlayNoRowsTemplate="등록된 계획서가 없습니다.">
            </ag-grid-vue>
          </template>
          <template v-slot:footer>
            <button type="button" class="btn btn-secondary" @click="modalOpen">닫기</button>
          </template>
        </Layout>
      <!--검색모달[E]-->

      <div class="card-body">
        <div class="row">

          <!--생산제품 목록-->
          <div class="col-md-7">
            <p class="text-uppercase text-lg font-weight-bolder">생산제품 목록</p>
            <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
              <symbol id="check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </symbol>
            </svg>
            <div class="alert alert-primary d-flex align-items-center" role="alert">
              <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Warning:"><use xlink:href="#check-circle-fill"/></svg>
              <div>공정/자재 설정이 완료 제품만 생산가능합니다.</div>
            </div>
            <div class="table-responsive">
              <table class="table">
                <thead class="table-secondary">
                  <tr>
                    <th class="text-center text-uppercase text-ser opacity-7" width="5%"></th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 제품코드 </th>
                    <th class="text-center text-uppercase text-ser opacity-7"> 제품명 </th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%"> 계획수량</th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%"> 공정설정</th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%"> 자재설정</th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%"></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="planDtlCount >0">
                    <tr :key="i" v-for="(Dtl, i) in planDtlData" class="text-center align-middle planDtl"  :class="Dtl.flow_cnt < 1 || Dtl.mtl_cnt < 1 ? 'none-select' : ''" v-bind:id="Dtl.prd_cd+'_dtl'" >
                      <td>
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" v-model="prdArr" :value="Dtl" :id="'fl' + Dtl.PRD_CD">
                        </div>
                      </td>
                      <td>{{ Dtl.prd_cd }}</td>
                      <td>{{ Dtl.prd_nm }}</td>
                      <td>{{ Dtl.order_qty }}</td>
                      <td><span :class="Dtl.flow_cnt > 0 ? 'text-primary' : 'text-secondary'"><b> {{ Dtl.flow_cnt > 0 ? "설정됨" : "미설정" }}</b></span></td>
                      <td><span :class="Dtl.mtl_cnt > 0 ? 'text-primary' : 'text-secondary'"><b> {{ Dtl.mtl_cnt > 0 ? "설정됨" : "미설정" }}</b></span></td>
                      <td><button @click="prdClicked(Dtl.prd_cd)" class="btn btn-sm btn-warning">SELECT</button></td>
                    </tr>
                  </template>

                  <tr v-else>
                    <td colspan="7">
                      <div class="list-nodata">생산계획코드를 검색해주세요.</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!--공정설정-->
          <div class="col-md-5">

            <p class="text-uppercase text-lg font-weight-bolder">공정설정</p>
            <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
              <symbol id="check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </symbol>
            </svg>
            <div class="alert alert-primary d-flex align-items-center" role="alert">
              <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Warning:"><use xlink:href="#check-circle-fill"/></svg>
              <div>생산에 사용할 공정을 선택해주세요.</div>
            </div>
            <div class="table-responsive">
              <table class="table">
                <thead class="table-secondary">
                  <tr>
                    <th class="text-center text-uppercase text-ser opacity-7" width="5%"></th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 공정코드 </th>
                    <th class="text-center text-uppercase text-ser opacity-7">공정명</th>
                    <th class="text-center text-uppercase text-ser opacity-7">공정설명</th>
                  </tr>
                </thead>   
                  <draggable :list="planFlowData" tag="tbody" @change="changeDrag" :animation="300">
                    <template v-if="planFlowCount >0">
                      <tr  class="text-center align-middle"
                        v-for="Flow in planFlowData"
                        :key="Flow.PROC_FLOW_CD">
                        <td>
                          <div class="form-check col-4 col-md-2">
                            <input class="form-check-input" type="checkbox" v-model="flowArr" :value="Flow" :id="'fl' + Flow.PROC_FLOW_CD" checked="true"> 
                            <span id="'num' + Flow.PROC_FLOW_CD">{{Flow.PROC_SEQ}}</span>
                          </div>
                        </td>
                        <td>{{ Flow.PROC_FLOW_CD }}</td>
                        <td>{{ Flow.PROC_NM }}</td>
                        <td>{{ Flow.NOTE }}</td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td colspan="5">
                        <div class="list-nodata">생산제품을 선택해주세요.</div>
                      </td>
                    </tr>
                  </draggable>
              </table>
            </div>
          </div>
        </div>
        <div class="center" v-if="this.$session.get('user_ps') == 'H01'">
          <button class="btn btn-primary mtp30" @click="instInsert">등록</button>
          <button class="btn btn-secondary mlp10 mtp30" @click="resetForm">초기화</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import Layout from '../components/modalLayout.vue';
import { VueDraggableNext } from 'vue-draggable-next'

export default {
  components: { 
    AgGridVue, 
    Layout, 
    draggable: VueDraggableNext
  },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산지시서 관리' });
    this.getPlanFlowList();
  },
  computed : {
    planDtlCount(){
        return this.planDtlData.length;
    },
    planFlowCount(){
        return this.planFlowData.length;
    }
  },
  data() {
    return {
      plan_cd : "", //검색어
      isModal: false,
      flowArr: [],
      prdArr: [],
      planDtlData: [],
      planFlowData: [],
      prd_cd: "",
      instInfo: [],

      /* 모달 계획서 목록 */
      planDefs: [
        { headerName: '계획서코드', field: 'PROD_PLAN_CD', sortable: true, width: 120, cellStyle: {textAlign: "center"} },
        { headerName: '생산시작일', field: 'START_DT', sortable: true, valueFormatter: this.$comm.dateFormatter, width: 150, cellStyle: {textAlign: "center"} },
        { headerName: '생산종료일', field: 'END_DT', sortable: true, valueFormatter: this.$comm.dateFormatter, width: 150, cellStyle: {textAlign: "center"} },
        { headerName: '제품수량', field: 'DTL_QTY', sortable: true, width: 100, cellStyle: {textAlign: "center"}},
        { headerName: '등록일', field: 'CREATE_DT', valueFormatter: this.$comm.dateFormatter, width: 150, cellStyle: {textAlign: "center"} },
      ],
      planData: [],


      modalOptions: {
        pagination: true,
        paginationAutoPageSize: true,
        suppressMovableColumns: true // 컬럼 드래그 이동 방지                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
      },

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
      this.getPlanList();
    },
    modalClicked(params) {
      this.getPlanDtlList(params.data.PROD_PLAN_CD);
      this.plan_cd= params.data.PROD_PLAN_CD;
      this.order_cd= params.data.ORDER_CD;
      this.isModal = !this.isModal;
    },
    modalCloseFunc() {
      if(this.isModal){
        this.isModal = !this.isModal;
      }
    },
    /*모달 [E]*/

    //계획서 리스트
    async getPlanList() {
      let obj = {
        NOT_STATUS : 'Z03'
      }
      let result = await axios.get(`/api/plan`, {params:obj})
                              .catch(err => console.log(err));
      this.planData = result.data;
    },

    //계획서 제품 리스트
    async getPlanDtlList(plan_cd) {
      let result = await axios.get(`/api/plan/${plan_cd}/dtl`)
                              .catch(err => console.log(err));                              
      this.planDtlData = result.data;

      this.planDtlData.forEach((obj) => {
        if(obj.flow_cnt > 0 && obj.mtl_cnt > 0){
          this.prdArr.push(obj);
        }
      });
      
    },

    //계획서 제품 리스트 선택
    prdClicked(prd_cd) {
      this.prd_cd = prd_cd;
      this.getPlanFlowList(prd_cd); //공정 및 자재설정 리스트 노출

      //선택된 생산제품 색깔표기[S]
      const elements = document.querySelectorAll('.planDtl');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('table-warning');
      }
      document.getElementById(prd_cd+'_dtl').classList.add('table-warning');
      //선택된 생산제품 색깔표기[E]

    },

    //지시서 조회
    async getInstInfo(selectNo) {
      let result = await axios.get(`/api/inst/${selectNo}`)
                              .catch(err => console.log(err));
      this.instInfo = result.data;
      this.plan_cd = this.instInfo.PROD_PLAN_CD;
      this.work_dt = this.$comm.getMyDay(this.instInfo.WORK_DT);

      this.getPlanDtlList(this.plan_cd);

    },

    //제품별 공정 리스트
    async getPlanFlowList(prd_cd) {
      let result = await axios.get(`/api/inst/${prd_cd}/flow`)
                              .catch(err => console.log(err));                              
      this.planFlowData = result.data;

      const chkArr = new Map();

      const key = prd_cd;
      if (!chkArr.has(key)) {
        chkArr.set(key, {
            details: []
        });
      }
      // 디테일 데이터 추가
      chkArr.get(key).details.push(
        this.planFlowData
      );
      console.log(chkArr)
    },

    //공정설정 리스트 드래그 시 이벤트 (공정 순서 재정렬)
    changeDrag() {
      this.planFlowData.forEach((obj, index) => {
          obj.PROC_SEQ = index+1;
      });
    },

    //지시서 등록
    async instInsert() {
      if (!this.plan_cd) {
          this.$swal({
              icon: "error",
              title: "생산계획코드를 입력하세요",
              text: "생산계획코드 검색하여 생산지시서를 등록해주세요.",
          });
          return;
      }
      let insertInst = []; //생산지시서
      insertInst.push({
        PROD_PLAN_CD: this.plan_cd, 
        ORDER_CD: this.order_cd, 
        WORK_DT: this.work_dt
      });
      let insertPrd = [];  //생산지시서 제품
      let insertFlow = [];  //생산지시서 공정흐름

      this.prdArr.forEach((obj) => {
        insertPrd.push({
          prd_cd: obj.prd_cd,
          total_qty: obj.order_qty
        });
      });
      
      this.flowArr.forEach((obj) => {
        insertFlow.push({
          PRD_CD: obj.PRD_CD,
          PROC_FLOW_CD: obj.PROC_FLOW_CD,
          PROC_CD: obj.PROC_CD,
          STEP: obj.PROC_SEQ
        });
      });
      
      let insertArr = [...insertInst, insertPrd, insertFlow];

      let result = await axios.post('/api/inst', insertArr)
                 .catch(err => console.log(err));

      if(result.data == 'success'){
        this.$swal({
          icon: "success",
          title: "등록완료",
          text: "등록한 지시서는 목록에서 확인 해주세요.",
        })
        .then(() => {
            this.resetForm();   //등록 후 값 초기화
        });          
      }
      return result;
    },
    // 등록 후 초기화 기능
    resetForm() {
      this.plan_cd = '';
      this.work_dt = '';
      this.planDtlData = [];
      this.planFlowData = [];

    },
  }
};
</script>