<!-- 생산계획서 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">      
      <div class="card-header ps-5 ps-md-4">
        <h5 class="modal-title mb-3">1. 생산지시서 선택</h5>
        <!--지시서 검색-->
        <div class="row">
          <div class="input-group w-50 mbp10">
            <input class="form-control" type="text" v-model="inst_cd" placeholder="생산지시서 코드를 검색해주세요"
              style="height: 41px;">
            <button class="btn btn-warning" type="button" @click="modalOpen">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

         <!--검색모달[S]-->
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
              @grid-ready="gridFit"
              @rowClicked="modalClicked" 
              :grid-options="modalOptions"
              @rowIndexChanged="RowIndexChangedEvent"
              overlayNoRowsTemplate="등록된 지시서가 없습니다.">
              </ag-grid-vue>
            </template>
            <template v-slot:footer>
              <button type="button" class="btn btn-secondary" @click="modalOpen">Cancel</button>
              <button type="button" class="btn btn-primary" @click="modalOpen">OK</button>
            </template>
          </Layout>
        <!--검색모달[E]-->

        <!--지시서 목록-->       
        <div class="table-responsive">
          <table class="table">
            <thead class="table-secondary">
              <tr>
                <th class="text-center text-uppercase text-ser opacity-7" width="1%"></th>
                <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 제품코드 </th>
                <th class="text-center text-uppercase text-ser opacity-7">제품명</th>
                <th class="text-center text-uppercase text-ser opacity-7">지시량</th>
              </tr>
            </thead>   
            <tbody>
              <template v-if="instDtlCount >0">
                <tr class="text-center align-middle"
                v-for="val in instDtlData"
                :key="val.INST_DTL_CD">
                  <td>
                    <div class="form-check col-10 d-flex">
                      <input class="form-check-input ms-1" type="radio" v-model="inst_radio" :value="val.PRD_CD" :id="'radio' + val.PRD_CD" @change="getFlowList">
                    </div>
                  </td>
                  <td>
                    <label class="form-check-label ms-2 me-4 text-start" :for="'radio' + val.PRD_CD">
                      {{val.PRD_CD}}
                    </label>
                  </td>
                  <td>{{ val.PRD_NM }}</td>
                  <td>{{ val.TOTAL_QTY }}</td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="5">
                  <div class="list-nodata">생산지시서를 선택해주세요.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>{{  this.$session.get('user_id')}}

        <hr class="horizontal dark">
        
        <div class="row">
          <!--공정목록-->
          <h5 class="modal-title mb-3">2. 제품 공정목록</h5>
          <div class="col-6">
            <div class="table-responsive produce">
              <table class="table">
                <thead class="table-secondary">
                  <tr>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 순번 </th>
                    <th class="text-center text-uppercase text-ser opacity-7">공정코드</th>
                    <th class="text-center text-uppercase text-ser opacity-7">공정명</th>
                    <th class="text-center text-uppercase text-ser opacity-7">상태</th>
                    <th class="text-center text-uppercase text-ser opacity-7" colspan="2"></th>
                  </tr>
                </thead>   
                <tbody>
                  <template v-if="flowCount >0">
                    <template v-for="flow in flowData" :key="flow.INST_CD">
                      <tr class="text-center align-middle flowList" :class="'flow_'+flow.INST_CD" @click="getFlowEquList(flow.EQP_TYPE);showProcess(flow.INST_CD);">
                        <td>{{ flow.STEP }}</td>
                        <td>{{ flow.PROC_CD }}</td>
                        <td>{{ flow.PROC_NM }}</td>
                        <td>{{ flow.ACT_TYPE }}</td>                      
                        <td>
                          <button class="btn btn-dark btn-sm">선택하기</button>
                        </td>
                      </tr>

                      <template v-for="equ in equData" :key="equ.EQP_CD">
                        <template v-if="equ.EQP_TYPE == flow.EQP_TYPE">
                          <tr class="text-center align-middle sub-tr" :class="equ.ACT_TYPE == '비가동' ? 'none-select' : ''">
                            <td>
                              <div class="form-check col-10 d-flex">
                                <input class="form-check-input ms-1" type="radio" v-model="equ_radio" :value="equ.EQP_CD" :id="'radio' + equ.EQP_CD">
                              </div>
                            </td>
                            <td>{{ equ.EQP_CD }}</td>
                            <td>{{ equ.EQP_NM }}</td>
                            <td>{{ equ.ACT_TYPE }}</td>
                            <td class="form-inline"><input type="number" class="form-control form-control-xsm w-30"> ℃</td>
                          </tr>
                        </template>
                      </template>
                    </template>
                  </template>
                  <tr v-else>
                    <td colspan="5">
                      <div class="list-nodata">생산지시서를 선택해주세요.</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="col-6 bg-light ">

            <template v-if="equ_radio">
              <!--공정설정-->        
              <div class="row">
                <div class="col-8">
                  <div class="row mtp10">
                    <div class="col-3 text-center font-weight-bolder mtp10">담당자명</div>
                    <div class="input-group w-50">
                    <input class="form-control form-control-sm" type="text" v-model="inst_cd" placeholder="담당자를 검색해주세요" style="height: 41px;">
                    <button class="btn btn-warning" type="button" @click="searchOrder"><i class="fa-solid fa-magnifying-glass"></i></button>
                  </div>
                  </div>
              </div>
                <div class="col-2">

                </div>
              </div>    
              <div class="row">
                <div class="col-8">
                  <!--
                  <div class="row mtp10">
                    <div class="col-3 text-center fw-bolder">담당자명</div>
                    <div class="input-group w-30">
                      <input class="form-control form-control-sm" type="text" v-model="inst_cd" placeholder="담당자를 검색해주세요" style="height: 41px;">
                      <button class="btn btn-warning mb-3" type="button" @click="searchOrder"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                  </div>
                  -->

                  <div class="row mtp10">
                    <div class="col-3">
                      <button class="btn btn-success">작업시작</button>
                    </div>
                    <input class="form-control form-control-sm w-50" type="text" v-model="inst_cd" placeholder="담당자를 검색해주세요" style="height: 41px;">
                  </div>

                  <div class="row mtp10">
                    <div class="col-3">
                      <button class="btn btn-danger">작업종료</button>
                    </div>
                    <input class="form-control form-control-sm w-50" type="text" v-model="inst_cd" placeholder="담당자를 검색해주세요" style="height: 41px;">
                  </div>
                </div>

                <div class="col-2">
                  <div class="row mtp10">
                    <button class="btn btn-warning">품질검사 수행</button>
                  </div>
                </div>
              </div>
              <div class="center">
                <button class="btn btn-primary mtp30" @click="instInsert">SUBMIT</button>
                <button class="btn btn-secondary mlp10 mtp30" @click="resetForm">RESET</button>
              </div>
            </template>

            <div v-else>
              <p class="list-nodata">제품 공정을 선택해주세요.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';
import { AgGridVue } from 'ag-grid-vue3';
import Layout from '../components/modalLayout.vue';

export default {
  components: { AgGridVue, Layout },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산공정관리' });
  },
  computed : {
      instDtlCount(){
        return this.instDtlData.length;
      },
      flowCount(){
        return this.flowData.length;
      }
  },
  data() {
    return {
      isModal: false,
      inst_cd:'',
      instDefs: [
        { headerName: '지시서코드', field: 'INST_CD', sortable: true, width: 120 },
        { headerName: '생산제품수', field: 'PRD_CNT', sortable: true },
        { headerName: '진행상태', field: 'ACT_TYPE', sortable: true },
        { headerName: '작업일자', field: 'WORK_DT', sortable: true, valueFormatter: this.$comm.dateFormatter },
        { headerName: '등록일', field: 'CREATE_DT', valueFormatter: this.$comm.dateFormatter },
      ],
      instData: [],
      instDtlData: [],
      flowData: [],
      equData: [],
      inst_radio:'',
      equ_radio:'',
    };
  },
  methods: {    
    /*모달 [S]*/
    modalOpen() {
      this.isModal = !this.isModal;
      this.getInstList();
    },
    modalClicked(params) {
      this.getInstDtlList(params.data.INST_CD);
      this.inst_cd= params.data.INST_CD;
      this.isModal = !this.isModal;
    },
    /*모달 [E]*/

    //지시서 리스트
    async getInstList() {
      let result = await axios.get('/api/inst')
                              .catch(err => console.log(err));
      this.instData = result.data;
    },

    //지시서 제품 리스트
    async getInstDtlList(inst_cd) {
      
      let result = await axios.get(`/api/inst/dtl/${inst_cd}`)
                              .catch(err => console.log(err));
      this.instDtlData = result.data;
    },
    
    //제품별 공정 리스트
    async getFlowList() {
      let obj = {
          INST_CD : this.inst_cd,
          PRD_CD : this.inst_radio,
      }
      let result = await axios.get('/api/progress/flow', {params:obj})
                              .catch(err => console.log(err));
      this.flowData = result.data;
    },

    //공정별 설비 리스트
    async getFlowEquList(equ_type) {
      let result = await axios.get(`/api/progress/equ/${equ_type}`)
                              .catch(err => console.log(err));
      this.equData = result.data;
    },

    showProcess(flow_cd){
      const elements = document.querySelectorAll('.flowList');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('table-primary');
      }
      const flow = document.querySelector('.flow_'+flow_cd);
      flow.classList.add("table-primary");


    }
  }
    
};

</script>